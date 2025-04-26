import { NextResponse, type NextRequest } from 'next/server'
import { authenticate } from '@/lib/auth/server'
import { Encrypt } from '@/lib/encrypt'
import { prisma } from '@/lib/prisma'
import { randomUUID } from 'crypto'

import type { User } from '@/types/user'

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

    return NextResponse.json(
      {
        message: 'Success',
        data: {
          ...user,
          password: undefined,
          verificationToken: undefined
        }
      },
      {
        status: 201
      }
    )
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

export const DELETE = async (request: NextRequest) => {
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

    await prisma.user.delete({ where: user })

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

export const POST = async (request: NextRequest) => {
  try {
    const { name, username, email, password } = await request.json()
    if (!name || !username || !email || !password) {
      throw new Error('`name`, `username`, `email` and `password` field is required')
    }

    const user = await prisma.user.findUnique({
      where: {
        username,
        email
      }
    })

    if (user) {
      throw new Error('User with these stuff already exists!')
    }

    await prisma.user.create({
      data: {
        name,
        username,
        email,
        verificationToken: randomUUID(),
        password: await Encrypt.encrypt(password)
      }
    })

    return NextResponse.json(
      {
        message: 'Success',
        data: {}
      },
      {
        status: 201
      }
    )
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

export const PATCH = async (request: NextRequest) => {
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

    const { name, username, email, systemPrompt, shareInfoWithAI } = (await request.json()) as User

    if (username && user.username !== username) {
      if (
        await prisma.user.findUnique({
          where: {
            username
          }
        })
      ) {
        throw new Error('User with that username exists!')
      }
    }

    await prisma.user.update({
      where: {
        username,
        email,
        id: user.id
      },
      data: {
        name,
        username,
        email,
        systemPrompt,
        shareInfoWithAI
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
