import { NextResponse, type NextRequest } from 'next/server'
import { authenticate } from '@/lib/auth/server'
import { CONSTANTS } from '@/lib/constants'
import { prisma } from '@/lib/prisma'

import type { Message, MessagePart } from '@prisma/client'

export const DELETE = async (
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
    const [isTokenValid, payload, user] = await authenticate(request.headers)
    if (!isTokenValid || !payload) {
      return NextResponse.json(
        {
          message: 'Unauthorized',
          data: {}
        },
        {
          status: 403
        }
      )
    }

    const { id } = await params

    await prisma.chat.delete({
      where: {
        id,

        userId: user.id
      }
    })

    return NextResponse.json({
      message: 'Success',
      data: {}
    })
  } catch (error) {
    return NextResponse.json(
      {
        message: (error as Error).message,
        data: {}
      },
      { status: 500 }
    )
  }
}

export const GET = async (
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
    const [isTokenValid, payload, user] = await authenticate(request.headers)
    if (!isTokenValid || !payload) {
      return NextResponse.json(
        {
          message: 'Unauthorized',
          data: {}
        },
        {
          status: 403
        }
      )
    }

    const { id } = await params

    const convertToUIMessage = (message: Message & { parts: MessagePart[] }) => {
      return {
        ...message,
        parts: message.parts.map((part) => {
          if (part.type === 'text') {
            return {
              ...part,
              text: part.text
            }
          }

          if (part.type === 'reasoning') {
            return {
              ...part,
              reasoning: part.text
            }
          }

          if (part.type === 'source') {
            const [url, title] = part.text.split(';') || [part.text, null]

            return {
              ...part,
              source: { url, title }
            }
          }
        })
      }
    }

    if (id === '-1') {
      const chats = await prisma.chat.findMany({
        take: 1,
        orderBy: {
          updatedAt: 'desc'
        },
        include: {
          messages: {
            include: {
              files: true,
              parts: true
            }
          }
        },
        where: {
          userId: user.id
        }
      })

      let chat: any
      if (chats.length < 1) {
        chat = await prisma.chat.create({
          data: {
            title: 'New chat',

            model: CONSTANTS.AI.DEFAULT_MODEL,

            userId: user.id
          },
          include: {
            messages: {
              include: {
                files: true
              }
            }
          }
        })
      } else {
        chat = chats[0]
      }

      return NextResponse.json({
        message: 'Success',
        data: {
          ...chat,
          messages: chat.messages.map(convertToUIMessage)
        }
      })
    }

    const chat = await prisma.chat.findUnique({
      where: {
        id,

        userId: user.id
      },
      include: {
        messages: {
          include: {
            files: true,
            parts: true
          }
        }
      }
    })

    if (!chat) {
      throw new Error('Chat with this id not found!')
    }

    return NextResponse.json({
      message: 'Success',
      data: {
        ...chat,
        messages: chat.messages.map(convertToUIMessage)
      }
    })
  } catch (error) {
    return NextResponse.json(
      {
        message: (error as Error).message,
        data: {}
      },
      { status: 500 }
    )
  }
}
