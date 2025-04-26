import { NextResponse, type NextRequest } from 'next/server'
import { Encrypt } from '@/lib/encrypt'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { CookieMonster } from '@/lib/cookie-monster'
import { CONSTANTS } from '@/lib/constants'
import { UserAPIManager } from '@/lib/api/user'
import { Secrets } from '@/lib/secrets'
import jwt from 'jsonwebtoken'

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
        id: user.id
      },
      Secrets.appSecret,
      {
        expiresIn: '30d'
      }
    )

    if (!user.verified) await UserAPIManager.sendEmail(token)

    const cookieMonster = new CookieMonster(await cookies())
    cookieMonster.set(CONSTANTS.COOKIES.TOKEN_NAME, token, {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    })

    const response = NextResponse.json({
      message: 'Success',
      data: {
        token
      }
    })

    response.cookies.set(CONSTANTS.COOKIES.TOKEN_NAME, token, {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
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
