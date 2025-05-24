import 'server-only'

import { type NextRequest, NextResponse } from 'next/server'
import { SessionAPIManager } from '@/lib/api/session'
import { getTranslations } from 'next-intl/server'
import { Secrets } from '@/lib/secrets'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'
import type { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies'
import type { JWTPayload } from '@/types/jwt'
import type { User } from '@/types/user'

enum AuthErrorMessages {
  HEADER_NOT_FOUND = 'header-not-found',
  TOKEN_NOT_FOUND = 'token-not-found',
  USER_NOT_FOUND = 'user-not-found',
  EXPIRED = 'expired'
}

export const verifyToken = async (
  headers: Headers,
  cookies: ReadonlyRequestCookies | RequestCookies,
  checkExpirationDate: boolean = true
): Promise<
  [true, User, JWTPayload, undefined] | [false, undefined, undefined, AuthErrorMessages]
> => {
  const authorization = headers.get('authorization')
  if (!authorization) return [false, undefined, undefined, AuthErrorMessages.HEADER_NOT_FOUND]

  const [_, token] = authorization.split(' ') || []
  if (!token) return [false, undefined, undefined, AuthErrorMessages.HEADER_NOT_FOUND]

  const locale = headers.get('accept-language') || 'en'

  try {
    const decoded = jwt.verify(token, Secrets.appSecret) as JWTPayload

    const user = (await prisma.user.findUnique({
      where: {
        id: decoded.id
      },
      include: {
        profile: true,
        customization: true,

        usages: true,

        subscription: true,

        sessions: true
      }
    })) as User

    if (!user) {
      await SessionAPIManager.delete({ locale }, { cookieStore: cookies as ReadonlyRequestCookies })

      return [false, undefined, undefined, AuthErrorMessages.USER_NOT_FOUND]
    }

    const session = await prisma.session.findUnique({
      where: {
        id: decoded.token,

        userId: user.id
      }
    })

    if (!session) {
      await SessionAPIManager.delete({ locale }, { cookieStore: cookies as ReadonlyRequestCookies })

      return [false, undefined, undefined, AuthErrorMessages.TOKEN_NOT_FOUND]
    }

    if (checkExpirationDate && session.expiresAt < new Date()) {
      await SessionAPIManager.delete(
        { locale, token },
        { cookieStore: cookies as ReadonlyRequestCookies }
      )

      return [false, undefined, undefined, AuthErrorMessages.EXPIRED]
    }

    return [true, user, decoded, undefined]
  } catch {
    return [false, undefined, undefined, AuthErrorMessages.EXPIRED]
  }
}

export const authenticate = async (
  request: NextRequest,
  locale: string
): Promise<[NextResponse, undefined, undefined] | [undefined, User, JWTPayload]> => {
  const t = await getTranslations({ locale })

  const [_, user, payload, message] = await verifyToken(request.headers, request.cookies)

  if (message) {
    switch (message) {
      case AuthErrorMessages.TOKEN_NOT_FOUND:
      case AuthErrorMessages.HEADER_NOT_FOUND:
        return [
          NextResponse.json(
            {
              message: t('errors.unauthorized'),
              data: {}
            },
            {
              status: 401
            }
          ),
          undefined,
          undefined
        ]

      case AuthErrorMessages.USER_NOT_FOUND:
        return [
          NextResponse.json(
            {
              message: t('api.user.not-found'),
              data: {}
            },
            {
              status: 401
            }
          ),
          undefined,
          undefined
        ]

      case AuthErrorMessages.EXPIRED:
        return [
          NextResponse.json(
            {
              message: t('api.session-expired'),
              data: {}
            },
            {
              status: 401
            }
          ),
          undefined,
          undefined
        ]
    }
  }

  return [undefined, user, payload]
}
