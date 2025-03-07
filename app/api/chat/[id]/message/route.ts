import { type NextRequest, NextResponse } from 'next/server'
import { appendClientMessage, smoothStream, streamText } from 'ai'
import { AIModels, type AIModelName } from '@/lib/ai/models'
import { verifyToken } from '@/lib/auth/server/verify-token'
import { prisma } from '@/lib/prisma'

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
    const [isTokenValid, payload] = await verifyToken(request.headers)
    if (!isTokenValid || !payload) {
      throw new Error('Invalid token.')
    }

    const user = await prisma.user.findUnique({
      where: {
        id: payload.id
      }
    })

    if (!user) {
      throw new Error('User not found!')
    }

    const { id } = await params

    const { message, model: modelName } = await request.json()

    const chat = await prisma.chat.findUnique({
      where: {
        id
      },
      include: {
        messages: true
      }
    })

    if (!chat) {
      throw new Error('Chat not found')
    }

    await prisma.message.create({
      data: {
        role: message.role,
        content: message.content,

        chatId: id
      }
    })

    const messages = appendClientMessage({
      messages: chat.messages as any,
      message
    })

    const models = AIModels.get()

    const model = modelName ? models[modelName as AIModelName] : models['gemini-2.0-flash']
    if (model.plus && !user.plus) {
      throw new Error('This model is for plus users!')
    }

    if (model.premium) {
      if (user.premiumCredits < 1) {
        throw new Error('Not enough credits!')
      }
    } else {
      if (user.credits < 1) {
        throw new Error('Not enough credits!')
      }
    }

    const result = streamText({
      model: model.provider,
      messages,
      experimental_transform: smoothStream(),
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
            credits: user.credits - 1
          }
        })
      }
    })

    return result.toDataStreamResponse({
      getErrorMessage: (error: unknown) => {
        console.log(error)

        return (error as any).message || 'Error while generating content. Please try again'
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
