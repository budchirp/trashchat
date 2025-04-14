import { type NextRequest, NextResponse } from 'next/server'
import { appendClientMessage, generateText, smoothStream, streamText } from 'ai'
import { verifyToken } from '@/lib/auth/server/verify-token'
import { AIModels, type AIModelID } from '@/lib/ai/models'
import { constructSystemPrompt } from '@/lib/ai/prompt'
import { prisma } from '@/lib/prisma'
import { getTranslations } from 'next-intl/server'

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
    const t_auth = await getTranslations({ locale, namespace: 'auth' })

    const [isTokenValid, payload] = await verifyToken(request.headers)
    if (!isTokenValid || !payload) {
      throw new Error(t_common('invalid-token'))
    }

    const user = await prisma.user.findUnique({
      where: {
        id: payload.id
      }
    })

    if (!user) {
      throw new Error(t_auth('not-found'))
    }

    const { id } = await params

    const { message, model: modelName } = await request.json()

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

    await prisma.message.create({
      data: {
        role: message.role,
        content: message.content,

        chatId: chat.id
      }
    })

    const messages = appendClientMessage({
      messages: chat.messages as any,
      message
    })

    const models = AIModels.get()

    if (chat.messages.length < 2) {
      const { text: title } = await generateText({
        model: models['gemini-2.0-flash'].provider,
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

    const model = modelName ? models[modelName as AIModelID] : models['gemini-2.0-flash']
    if (model.plus && !user.plus) {
      throw new Error(t('plus-error'))
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
      messages,
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
      getErrorMessage: (error: unknown) => {
        console.log(error)

        return (error as any).message || t('error')
      }
    })
  } catch (error) {
    return NextResponse.json(
      {
        message: (error as any).message || 'Error while generating content. Please try again',
        details: (error as Error).message,
        data: {}
      },
      { status: 500 }
    )
  }
}
