import { NextResponse, userAgent, type NextRequest } from 'next/server'
import { CookieMonster } from '@/lib/cookie-monster'
import { getTranslations } from 'next-intl/server'
import { authenticate } from '@/lib/auth/server'
import { UserAPIManager } from '@/lib/api/user'
import { CONSTANTS } from '@/lib/constants'
import { Secrets } from '@/lib/secrets'
import { Encrypt } from '@/lib/encrypt'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

import type { JWTPayload } from '@/types/jwt'
import type { User } from '@/types/user'
import type { SessionPlatform } from '@prisma/client'

export const POST = async (request: NextRequest) => {
  try {
    const locale = request.headers.get('accept-language') || 'en'
    const t = await getTranslations({ locale })

    const { email, password } = await request.json()
    if (!email || !password) {
      throw new Error(t('api.required-fields', { fields: 'email, password' }))
    }

    const user = (await prisma.user.findUnique({
      where: {
        email
      },
      include: {
        profile: true,
        customization: true,
        usages: true
      }
    })) as User | null

    if (!user) {
      throw new Error(t('api.user.not-found'))
    }

    const passwordMatch = await Encrypt.compare(password, user.password)
    if (!passwordMatch) {
      throw new Error(t('api.user.invalid-password'))
    }

    if (!user.profile) {
      await prisma.profile.create({
        data: {
          userId: user.id,
          name: user.email.split('@')[0]
        }
      })
    }

    if (!user.customization) {
      await prisma.aICustomization.create({
        data: {
          userId: user.id,

          defaultModel: CONSTANTS.AI.DEFAULT_MODEL
        }
      })
    }

    if (!user.usages) {
      await prisma.usages.create({
        data: {
          userId: user.id
        }
      })
    }

    const expires = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip')?.trim() ||
      '0.0.0.0'

    const { browser, os, device } = userAgent(request)

    let platform: SessionPlatform = 'desktop'
    switch (device.type) {
      case 'mobile':
        platform = 'mobile'
        break

      case 'tablet':
        platform = 'tablet'
        break

      default:
        platform = 'desktop'
        break
    }

    const session = await prisma.session.create({
      data: {
        userId: user.id,

        expiresAt: expires,

        ip,

        platform,

        os: os?.name || 'Unknown',
        browser: browser?.name || 'Unknown'
      }
    })

    const token = jwt.sign(
      {
        id: user.id,
        token: session.id
      } as JWTPayload,
      Secrets.appSecret,
      {
        expiresIn: '14d'
      }
    )

    if (!user.isEmailVerified) await UserAPIManager.sendEmail({ token, locale })

    const cookieMonster = new CookieMonster(await cookies())
    cookieMonster.set(CONSTANTS.COOKIES.TOKEN_NAME, token, {
      expires
    })

    const response = NextResponse.json({
      message: t('common.success'),
      data: {
        token
      }
    })

    response.cookies.set(CONSTANTS.COOKIES.TOKEN_NAME, token, {
      expires
    })

    return response
  } catch (error) {
    console.log(error)

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
    const locale = request.headers.get('accept-language') || 'en'
    const t = await getTranslations({ locale })

    const [isTokenValid, payload, user] = await authenticate(request.headers, request.cookies)
    if (!isTokenValid || !payload) {
      return NextResponse.json(
        {
          message: t('errors.unauthorized'),
          data: {}
        },
        {
          status: 403
        }
      )
    }

    const token = await request.nextUrl.searchParams.get('token_id')
    if (token) {
      await prisma.session.delete({
        where: {
          id: token,

          userId: user.id
        }
      })
    } else {
      await prisma.session.delete({
        where: {
          id: payload.token,

          userId: user.id
        }
      })
    }

    const response = NextResponse.json({
      message: t('common.success'),
      data: {}
    })

    if (!token) {
      const cookieMonster = new CookieMonster(await cookies())
      cookieMonster.delete(CONSTANTS.COOKIES.TOKEN_NAME)

      response.cookies.delete(CONSTANTS.COOKIES.TOKEN_NAME)
    }

    return response
  } catch (error) {
    console.log(error)

    return NextResponse.json(
      {
        message: (error as Error).message,
        data: {}
      },
      { status: 500 }
    )
  }
}
