import { NextResponse, type NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth/server/verify-token'
import { Encrypt } from '@/lib/encrypt'
import { prisma } from '@/lib/prisma'

export const GET = async (request: NextRequest) => {
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

    return NextResponse.json(
      {
        message: 'Success',
        data: user
      },
      {
        status: 201
      }
    )
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
    const { name, username, email, password } = await request.json()
    if (!name || !username || !email || !password) {
      throw new Error('Name, Username, Email or Password is null!')
    }

    const user = await prisma.user.findUnique({
      where: {
        username,
        email
      }
    })

    if (user) {
      throw new Error('With these stuff already exists!')
    }

    await prisma.user.create({
      data: {
        name,
        username,
        email,
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
        details: (error as Error).message,
        data: {}
      },
      { status: 500 }
    )
  }
}

export const PATCH = async (request: NextRequest) => {
  try {
    const { name, username, email, password } = await request.json()
    if ((!name || !username || !email) && !password) {
      throw new Error('Name, Username, Email or Password is null!')
    }

    const user = await prisma.user.findUnique({
      where: {
        email
      }
    })

    if (!user) {
      throw new Error('User not found!')
    }

    if (user.username !== username) {
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

    const passwordMatch = await Encrypt.compare(password, user.password)
    if (!passwordMatch) {
      throw new Error('Invalid password!')
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
        email
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
