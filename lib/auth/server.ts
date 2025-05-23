import 'server-only'

import { SessionAPIManager } from '@/lib/api/session'
import { prisma } from '@/lib/prisma'
import { Secrets } from '@/lib/secrets'
import jwt from 'jsonwebtoken'

import type { JWTPayload } from '@/types/jwt'
import type { User } from '@/types/user'

import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'
import type { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies'

export const authenticate = async (
  headers: Headers,
  cookies: ReadonlyRequestCookies | RequestCookies
  // success, payload, user, exists
): Promise<[true, JWTPayload, User, true] | [false, undefined, undefined, boolean]> => {
  const authorization = headers.get('authorization')
  if (!authorization) return [false, undefined, undefined, false]

  const [_, token] = authorization.split(' ') || []
  if (!token) return [false, undefined, undefined, false]

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

      return [false, undefined, undefined, true]
    }

    const session = await prisma.session.findUnique({
      where: {
        id: decoded.token,

        userId: user.id
      }
    })

    if (!session) {
      await SessionAPIManager.delete({ locale }, { cookieStore: cookies as ReadonlyRequestCookies })

      return [false, undefined, undefined, true]
    }

    if (session.expiresAt < new Date()) {
      await SessionAPIManager.delete(
        { locale, token },
        { cookieStore: cookies as ReadonlyRequestCookies }
      )

      return [false, undefined, undefined, true]
    }

    return [true, decoded, user, true]
  } catch {
    return [false, undefined, undefined, false]
  }
}
