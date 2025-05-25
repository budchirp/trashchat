import { type NextRequest, NextResponse } from 'next/server'
import {
  extractReasoningMiddleware,
  generateObject,
  smoothStream,
  streamText,
  wrapLanguageModel,
  type Message
} from 'ai'
import { constructSystemPrompt } from '@/lib/ai/prompt'
import { getTranslations } from 'next-intl/server'
import { authenticate } from '@/lib/auth/server'
import { AIProviders } from '@/lib/ai/providers'
import { prisma } from '@/lib/prisma'
import { randomUUID } from 'crypto'
import { z } from 'zod'

import type { File } from '@prisma/client'
import type { GoogleGenerativeAIProviderOptions } from '@ai-sdk/google'
import type { OpenAIResponsesProviderOptions } from '@ai-sdk/openai/internal'
import type { AIModelID, AIModelReasoningOption } from '@/lib/ai/models'

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
    const t = await getTranslations({ locale })

    const [response, user] = await authenticate(request, locale)
    if (response) return response

    const {
      messages,
      model: modelName,
      files = [],
      reasoningEffort,
      useReasoning,
      useSearch
    }: {
      messages: Message[]
      model: AIModelID
      files: File[]
      reasoningEffort: AIModelReasoningOption
      useReasoning: boolean
      useSearch: boolean
    } = await request.json()

    const model = AIProviders.get(modelName)

    if (!user.subscription && (model.plus || useReasoning || useSearch || files.length > 0)) {
      throw new Error(t('chat.errors.plan-error'))
    }

    if (model.premium) {
      if (user.usages.premiumCredits < 1) {
        throw new Error(t('chat.errors.credit-error'))
      }
    } else {
      if (user.usages.credits < 1) {
        throw new Error(t('chat.errors.credit-error'))
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
      throw new Error(t('chat.errors.not-found'))
    }

    const message = messages[messages.length - 1]
    messages.pop()

    const { id: messageId } = await prisma.message.create({
      data: {
        role: message.role as 'user',

        model: 'user',

        content: message.content,

        userId: user.id,
        chatId: chat.id,

        parts: {
          create: [
            {
              type: 'text',

              text: message.content
            }
          ]
        }
      }
    })

    await Promise.all(
      (model.imageUpload || model.fileUpload ? files : []).map(async (file) => {
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

    let title = chat.title
    if (chat.messages.length < 2) {
      try {
        const { object } = await generateObject({
          model: AIProviders.get('gemini-2.0-flash').provider(),
          schema: z.object({
            title: z.string().max(75)
          }),
          system:
            "Generate a concise and relevant title (max 75 characters) based on the user's query or conversation",
          prompt: message.content
        })

        title = object.title
      } catch {}
    }

    await prisma.chat.update({
      where: {
        id: chat.id,

        userId: user.id
      },
      data: {
        model: model.id,
        title
      }
    })

    await prisma.usages.update({
      where: {
        userId: user.id
      },
      data: {
        credits: {
          decrement: 1
        },
        premiumCredits: {
          decrement: model.premium ? 1 : 0
        }
      }
    })

    const system = constructSystemPrompt(model, user)
    const wrappedModel =
      model.company === 'deepseek'
        ? wrapLanguageModel({
            model: model.provider(),
            middleware: [extractReasoningMiddleware({ tagName: 'think' })]
          })
        : model.provider(
            model.company === 'google' && model.search && useSearch
              ? {
                  useSearchGrounding: true
                }
              : undefined
          )

    const thinkingTokens = useReasoning
      ? reasoningEffort === 'low'
        ? 1024
        : reasoningEffort === 'medium'
          ? 2048
          : reasoningEffort === 'high'
            ? 4096
            : 0
      : 0

    const result = streamText({
      model: wrappedModel,
      system,
      experimental_transform: [
        smoothStream({
          chunking: 'word'
        })
      ],
      providerOptions: {
        anthtopic: model.reasoning
          ? {
              thinking: {
                type: useReasoning ? 'enabled' : 'disabled',
                budgetTokens: thinkingTokens
              }
            }
          : {},
        openai:
          model.reasoning && useReasoning
            ? ({
                reasoningEffort
              } satisfies OpenAIResponsesProviderOptions)
            : {},
        google: {
          ...(model.reasoning
            ? {
                thinkingConfig: {
                  includeThoughts: useReasoning,
                  thinkingBudget: thinkingTokens
                }
              }
            : {})
        } satisfies GoogleGenerativeAIProviderOptions
      },
      messages: [
        ...(chat.messages as any),
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: message.content
            },
            ...(model.fileUpload || model.imageUpload ? files : []).map((file) => {
              if (model.imageUpload && file.contentType.startsWith('image/')) {
                return {
                  type: 'image',
                  image: file.url
                }
              }

              if (model.fileUpload) {
                return {
                  type: 'file',
                  mimeType: file.contentType,
                  data: file.url,
                  filename: file.name
                }
              }
            })
          ]
        }
      ],
      onFinish: async ({ text, reasoning, sources = [], files = [] }) => {
        await prisma.message.create({
          data: {
            role: 'assistant',

            model: modelName,

            content: text,

            userId: user.id,
            chatId: chat.id,

            files: {
              create: await Promise.all(
                files.map(async (file) => {
                  return {
                    name: randomUUID(),
                    url: `data:${file.mimeType};base64,${file.base64}`,

                    contentType: file.mimeType
                  } as const
                })
              )
            },

            parts: {
              create: [
                {
                  type: 'text',
                  text: text
                },
                ...(reasoning
                  ? ([
                      {
                        type: 'reasoning',

                        text: reasoning
                      }
                    ] as const)
                  : []),
                ...(await Promise.all(
                  sources.map(async (source) => {
                    return {
                      type: 'source',

                      text: `${source.url};${source.title}`
                    } as const
                  })
                ))
              ]
            }
          }
        })
      }
    })

    return result.toDataStreamResponse({
      sendReasoning: true,
      sendSources: true,
      getErrorMessage: (error: unknown) => {
        console.log(error)

        return (error as any).message || t('chat.errors.api-error')
      }
    })
  } catch (error) {
    console.log(error)

    return NextResponse.json(
      {
        message: (error as any).message || 'Error while generating content. Please try again',
        data: {}
      },
      { status: 500 }
    )
  }
}
