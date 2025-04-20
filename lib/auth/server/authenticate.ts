import { Env } from '@/lib/env'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

import type { JWTPayload } from '@/types/jwt'
import type { User } from '@/types/user'
import { SessionAPIManager } from '@/lib/api/session'
import { cookies } from 'next/headers'

export const authenticate = async (
  headers: Headers
): Promise<[true, JWTPayload, User] | [false, undefined, undefined]> => {
  const authorization = headers.get('authorization')
  const [_, token] = authorization?.split(' ') || []
  if (!token) return [false, undefined, undefined]

  try {
    const decoded = jwt.verify(token, Env.appSecret) as JWTPayload

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id
      }
    })

    if (!user) {
      await SessionAPIManager.delete(await cookies())

      return [false, undefined, undefined]
    }

    return [true, decoded, user]
  } catch {
    return [false, undefined, undefined]
  }
}
