import { Env } from '@/lib/env'
import type { JWTPayload } from '@/types/jwt'
import jwt from 'jsonwebtoken'

export const verifyToken = async (headers: Headers): Promise<[boolean, JWTPayload | undefined]> => {
  const authorization = headers.get('authorization')
  const [_, token] = authorization?.split(' ') || []
  if (!token) return [false, undefined]

  try {
    const decoded = jwt.verify(token, Env.appSecret) as JWTPayload
    return [true, decoded]
  } catch {
    return [false, undefined]
  }
}
