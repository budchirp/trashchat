import { type NextRequest, NextResponse } from 'next/server'
import { appendClientMessage, smoothStream, streamText } from 'ai'
import { AIModels, type AIModelName } from '@/lib/ai/models'
import { verifyToken } from '@/lib/auth/server/verify-token'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export const POST = async (request: NextRequest) => {
  try {
    const [isTokenValid] = await verifyToken(request.headers)
    if (!isTokenValid) {
      throw new Error('Invalid token.')
    }

    const { message, chatId /* model */ } = await request.json()

    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId
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

        chatId
      }
    })

    const messages = appendClientMessage({
      messages: chat.messages as any,
      message
    })

    const model = null

    const models = AIModels.get()
    const result = streamText({
      model: model ? models[model as AIModelName] : models['gemini-2.0-flash'],
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
      }
    })

    return result.toDataStreamResponse({
      getErrorMessage: (error: unknown) => {
        console.log(error)

        return 'Error while generating content. Please try again'
      },
      headers: {
        'Transfer-Encoding': 'chunked',
        Connection: 'keep-alive'
      }
    })
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Error while generating content. Please try again',
        details: (error as Error).message,
        data: {}
      },
      { status: 500 }
    )
  }
}
