import { NextResponse, type NextRequest } from 'next/server'
import { authenticate } from '@/lib/auth/server/authenticate'
import { prisma } from '@/lib/prisma'
import type { Chat } from '@/types/chat'
import type { Message } from '@prisma/client'

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

    const decode = (chats: Chat[] | Chat): Chat[] | Chat => {
      const decodeMessages = (messages: Message[]): Message[] => {
        function isBase64(str: string) {
          if (str.length % 4 !== 0) {
            return false
          }

          const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/
          if (!base64Regex.test(str)) {
            return false
          }

          try {
            return btoa(atob(str)) === str
          } catch {
            return false
          }
        }

        return messages.map((message): Message => {
          try {
            return {
              ...message,
              content: isBase64(message.content)
                ? decodeURIComponent(escape(atob(message.content)))
                : message.content
            }
          } catch {
            return {
              ...message,
              content: message.content
            }
          }
        })
      }

      if (Array.isArray(chats)) {
        return chats.map((chat): Chat => {
          return {
            ...chat,
            messages: decodeMessages(chat.messages)
          }
        })
      }

      return {
        ...chats,
        messages: decodeMessages(chats.messages)
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
              files: true
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
        data: decode(chat)
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
            files: true
          }
        }
      }
    })

    if (!chat) {
      throw new Error('Chat with this id not found!')
    }

    return NextResponse.json({
      message: 'Success',
      data: decode(chat as any)
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
