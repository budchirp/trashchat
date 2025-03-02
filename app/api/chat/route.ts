import { NextResponse, type NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth/server/verify-token'
import { prisma } from '@/lib/prisma'

export const DELETE = async (request: NextRequest) => {
  try {
    const referer = request.headers.get('referer')
    if (!referer || !referer.startsWith(process.env.APP_URL || '')) {
      return NextResponse.json({ message: 'Forbidden', data: null }, { status: 403 })
    }

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

    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
    if (!id) {
      throw new Error('ID is null.')
    }

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

export const POST = async (request: NextRequest) => {
  try {
    const referer = request.headers.get('referer')
    if (!referer || !referer.startsWith(process.env.APP_URL || '')) {
      return NextResponse.json({ message: 'Forbidden', data: null }, { status: 403 })
    }

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

    const chat = await prisma.chat.create({
      data: {
        title: 'New chat',

        userId: user.id
      }
    })

    return NextResponse.json({
      message: 'Success',
      data: {
        id: chat.id
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

export const GET = async (request: NextRequest) => {
  try {
    const referer = request.headers.get('referer')
    if (!referer || !referer.startsWith(process.env.APP_URL || '')) {
      return NextResponse.json({ message: 'Forbidden', data: null }, { status: 403 })
    }

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

    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
    if (!id) {
      const chats = await prisma.chat.findMany({
        where: {
          userId: user.id
        }
      })

      return NextResponse.json({
        message: 'Success',
        data: chats
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
