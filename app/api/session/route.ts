import { NextResponse, type NextRequest } from 'next/server'
import { CookieMonster } from '@/lib/cookie-monster'
import { UserAPIManager } from '@/lib/api/user'
import { CONSTANTS } from '@/lib/constants'
import { Secrets } from '@/lib/secrets'
import { Encrypt } from '@/lib/encrypt'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

import type { JWTPayload } from '@/types/jwt'

export const POST = async (request: NextRequest) => {
  try {
    const { email, password } = await request.json()
    if (!email || !password) {
      throw new Error('`email` and `password` password field is required')
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
        id: user.id,
        email: user.email
      } as JWTPayload,
      Secrets.appSecret,
      {
        expiresIn: '14d'
      }
    )

    if (!user.verified) await UserAPIManager.sendEmail(token)

    const expires = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)

    const cookieMonster = new CookieMonster(await cookies())
    cookieMonster.set(CONSTANTS.COOKIES.TOKEN_NAME, token, {
      expires
    })

    const response = NextResponse.json({
      message: 'Success',
      data: {
        token
      }
    })

    response.cookies.set(CONSTANTS.COOKIES.TOKEN_NAME, token, {
      expires
    })

    return response
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

export const DELETE = async () => {
  try {
    const cookieMonster = new CookieMonster(await cookies())
    cookieMonster.delete(CONSTANTS.COOKIES.TOKEN_NAME)

    const response = NextResponse.json({
      message: 'Success',
      data: {}
    })

    response.cookies.delete(CONSTANTS.COOKIES.TOKEN_NAME)

    return response
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
