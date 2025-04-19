import { NextResponse, type NextRequest } from 'next/server'
import { authenticate } from '@/lib/auth/server/authenticate'
import { prisma } from '@/lib/prisma'

export const POST = async (request: NextRequest) => {
  try {
    const [isTokenValid, payload] = await authenticate(request.headers)
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

    const chat = await prisma.chat.create({
      data: {
        title: 'New chat',

        userId: user.id
      },
      include: {
        messages: true
      }
    })

    return NextResponse.json({
      message: 'Success',
      data: chat
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

export const GET = async (request: NextRequest) => {
  try {
    const [isTokenValid, payload] = await authenticate(request.headers)
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

    const chats = await prisma.chat.findMany({
      where: {
        userId: user.id
      }
    })

    return NextResponse.json({
      message: 'Success',
      data: chats
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
