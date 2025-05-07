import { type NextRequest, NextResponse } from 'next/server'
import { generateText, smoothStream, streamText, type Message } from 'ai'
import { authenticate } from '@/lib/auth/server'
import { AIModels, type AIModelID } from '@/lib/ai/models'
import { constructSystemPrompt } from '@/lib/ai/prompt'
import { prisma } from '@/lib/prisma'
import { getTranslations } from 'next-intl/server'
import { CONSTANTS } from '@/lib/constants'

import type { File } from '@prisma/client'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export const POST = async (
  request: NextRequest,
  {
    params
  }: {
    params: Promise<{
      id: string
    }>
  }
) => {
  try {
    const locale = request.headers.get('accept-language') || 'en'

    const t = await getTranslations({ locale, namespace: 'chat' })
    const t_common = await getTranslations({ locale, namespace: 'common' })

    const [isTokenValid, payload, user] = await authenticate(request.headers)
    if (!isTokenValid || !payload) {
      return NextResponse.json(
        {
          message: t_common('unauthorized'),
          data: {}
        },
        {
          status: 403
        }
      )
    }

    const {
      messages,
      model: modelName,
      files
    }: {
      messages: Message[]
      model: AIModelID
      files: File[]
    } = await request.json()

    if (!user.firstUsage) {
      await prisma.user.update({
        where: {
          id: user.id
        },
        data: {
          firstUsage: new Date(Date.now())
        }
      })
    } else {
      if (new Date(user.firstUsage).getTime() < new Date(Date.now()).getTime()) {
        await prisma.user.update({
          where: {
            id: user.id
          },
          data: {
            firstUsage: new Date(Date.now()),

            credits: user.verified ? CONSTANTS.USAGES[user.plus ? 'PLUS' : 'NORMAL'].CREDITS : 10,
            premiumCredits: CONSTANTS.USAGES[user.plus ? 'PLUS' : 'NORMAL'].PREMIUM_CREDITS
          }
        })
      }
    }

    const { id } = await params

    const chat = await prisma.chat.findUnique({
      where: {
        id,

        userId: user.id
      },
      include: {
        messages: true
      }
    })

    if (!chat) {
      throw new Error(t('not-found'))
    }

    const message = messages[messages.length - 1]
    const { id: messageId } = await prisma.message.create({
      data: {
        role: message.role,
        content: message.content,

        chatId: chat.id
      }
    })

    await Promise.all(
      (files || []).map(async (file) => {
        await prisma.file.create({
          data: {
            name: file.name,
            url: file.url,

            contentType: file.contentType,

            messageId
          }
        })
      })
    )

    const models = AIModels.get()

    if (chat.messages.length < 2) {
      const { text: title } = await generateText({
        model: models['gemini-2.5-flash'].provider,
        system:
          'Generate a ONE title thats max of 40 characters according to what user asking or talking. Just reply with the title nothing else. MAKE IT RELATED TO USERS REQUEST.',
        prompt: message.content
      })

      await prisma.chat.update({
        where: {
          id: chat.id,

          userId: user.id
        },
        data: {
          title
        }
      })
    }

    const model = modelName ? models[modelName] : models['gemini-2.5-flash']
    if (model.plus && !user.plus) {
      throw new Error()
    }

    if (model.premium) {
      if (user.premiumCredits < 1) {
        throw new Error(t('credit-error'))
      }
    } else {
      if (user.credits < 1) {
        throw new Error(t('credit-error'))
      }
    }

    await prisma.chat.update({
      where: {
        id: chat.id,

        userId: user.id
      },
      data: {
        model: model.id
      }
    })

    const result = streamText({
      model: model.provider,
      messages: [
        ...(chat.messages as any),
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: message.content
            },
            ...(files || []).map((file) => {
              if (file.contentType.startsWith('image/')) {
                return {
                  type: 'image',
                  image: file.url
                }
              }

              return {
                type: 'file',
                mimeType: file.contentType,
                data: file.url,
                filename: file.name
              }
            })
          ]
        }
      ],
      experimental_transform: smoothStream(),
      system: constructSystemPrompt(model, user),
      onFinish: async ({ response }) => {
        const message = response.messages[response.messages.length - 1]

        await prisma.message.create({
          data: {
            content: (message.content as any)[0].text,
            role: message.role,

            chatId: chat.id
          }
        })

        await prisma.user.update({
          where: {
            id: user.id
          },
          data: {
            credits: !model.premium ? user.credits - 1 : undefined,
            premiumCredits: model.premium ? user.premiumCredits - 1 : undefined
          }
        })
      }
    })

    return result.toDataStreamResponse({
      sendReasoning: true,
      sendSources: true,
      getErrorMessage: (error: unknown) => {
        console.log(error)

        return (error as any).message || t('error')
      }
    })
  } catch (error) {
    return NextResponse.json(
      {
        message: (error as any).message || 'Error while generating content. Please try again',
        data: {}
      },
      { status: 500 }
    )
  }
}
