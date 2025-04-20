import { NextResponse, type NextRequest } from 'next/server'
import { authenticate } from '@/lib/auth/server/authenticate'
import { prisma } from '@/lib/prisma'

export const POST = async (request: NextRequest) => {
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

    const chat = await prisma.chat.create({
      data: {
        title: 'New chat',

        userId: user.id
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
