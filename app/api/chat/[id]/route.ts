import { NextResponse, type NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth/server/verify-token'
import { prisma } from '@/lib/prisma'

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
        details: (error as Error).message,
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

    if (id === '-1') {
      const chats = await prisma.chat.findMany({
        take: 1,
        orderBy: {
          updatedAt: 'desc'
        },
        include: {
          messages: true
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
            messages: true
          }
        })
      } else {
        chat = chats[0]
      }

      return NextResponse.json({
        message: 'Success',
        data: {
          id: chat.id,

          title: chat.title,
          messages: chat.messages
        }
      })
    }

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
      throw new Error('Chat with this id not found!')
    }

    return NextResponse.json({
      message: 'Success',
      data: {
        id: chat.id,

        title: chat.title,
        messages: chat.messages
      }
    })
  } catch (error) {
    return NextResponse.json(
      {
        message: (error as Error).message,
        details: (error as Error).message,
        data: {}
      },
      { status: 500 }
    )
  }
}
