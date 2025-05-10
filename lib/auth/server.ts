import 'server-only'

import { SessionAPIManager } from '@/lib/api/session'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { Secrets } from '@/lib/secrets'
import jwt from 'jsonwebtoken'

import type { JWTPayload } from '@/types/jwt'
import type { User } from '@/types/user'

export const authenticate = async (
  headers: Headers
): Promise<[true, JWTPayload, User] | [false, undefined, undefined]> => {
  const authorization = headers.get('authorization')
  if (!authorization) return [false, undefined, undefined]

  const [_, token] = authorization.split(' ') || []
  if (!token) return [false, undefined, undefined]

  const locale = headers.get('accept-language') || 'en'

  try {
    const decoded = jwt.verify(token, Secrets.appSecret) as JWTPayload

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id
      }
    })

    if (!user) {
      await SessionAPIManager.delete({ locale }, await cookies())

      return [false, undefined, undefined]
    }

    if (user.email !== decoded.email) {
      await SessionAPIManager.delete({ locale }, await cookies())

      return [false, undefined, undefined]
    }

    return [true, decoded, user]
  } catch {
    return [false, undefined, undefined]
  }
}
