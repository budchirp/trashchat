import { NextResponse, type NextRequest } from 'next/server'
import { Encrypt } from '@/lib/encrypt'
import { prisma } from '@/lib/prisma'
import { Env } from '@/lib/env'
import jwt from 'jsonwebtoken'

export const POST = async (request: NextRequest) => {
  try {
    const { email, password } = await request.json()
    if (!email || !password) {
      throw new Error('Email or Password is null!')
    }

    const user = await prisma.user.findUnique({
      where: {
        email
      }
    })

    if (!user) {
      throw new Error('User not found!')
    }

    const passwordMatch = await Encrypt.compare(password, user.password)
    if (!passwordMatch) {
      throw new Error('Invalid password!')
    }

    const token = jwt.sign(
      {
        id: user.id
      },
      Env.appSecret,
      {
        expiresIn: '14d'
      }
    )

    return NextResponse.json({
      message: 'Success',
      data: {
        token
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
