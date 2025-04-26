import { Fetch } from '@/lib/fetch'
import { Env } from '@/lib/env'

import type { User } from '@/types/user'

export class UserAPIManager {
  public static verifyPassword = async (
    token: string,
    password: string
  ): Promise<[boolean, string | null]> => {
    try {
      const response = await Fetch.post<{
        message: string
      }>(
        `${Env.appUrl}/api/user/password/verify`,
        {
          password
        },
        {
          Authorization: `Bearer ${token}`
        }
      )

      if (response.ok) return [true, null]

      const json = await response.json()
      return [false, json.message]
    } catch {
      return [false, null]
    }
  }

  public static update = async (token: string, user: User): Promise<[boolean, string | null]> => {
    try {
      const response = await Fetch.patch<{
        message: string
      }>(`${Env.appUrl}/api/user`, user, {
        Authorization: `Bearer ${token}`
      })

      if (response.ok) return [true, null]

      const json = await response.json()
      return [false, json.message]
    } catch {
      return [false, null]
    }
  }

  public static get = async (token: string): Promise<User | null> => {
    try {
      const response = await Fetch.get<{
        data: User
      }>(`${Env.appUrl}/api/user`, {
        Authorization: `Bearer ${token}`
      })

      if (response.ok) {
        const json = await response.json()
        return json.data
      }

      return null
    } catch {
      return null
    }
  }

  public static delete = async (token: string): Promise<[boolean, string | null]> => {
    try {
      const response = await Fetch.delete<{
        message: string
      }>('/api/user', {
        Authorization: `Bearer ${token}`
      })

      if (response.ok) return [true, null]

      const json = await response.json()
      return [false, json.message]
    } catch {
      return [false, null]
    }
  }

  public static new = async (user: {
    name: string
    username: string
    email: string
    password: string
  }): Promise<[boolean, string | null]> => {
    try {
      const response = await Fetch.post<{
        message: string
      }>(`${Env.appUrl}/api/user`, user)

      if (response.ok) {
        return [true, null]
      }

      const json = await response.json()
      return [false, json?.message]
    } catch {
      return [false, null]
    }
  }

  public static sendEmail = async (token: string): Promise<boolean> => {
    try {
      const response = await Fetch.get(`${Env.appUrl}/api/user/verify/email`, {
        Authorization: `Bearer ${token}`
      })

      if (response.ok) {
        return true
      }

      return false
    } catch {
      return false
    }
  }

  public static verifyEmail = async (
    token: string,
    verificationToken: string
  ): Promise<boolean> => {
    try {
      const response = await Fetch.post(
        `${Env.appUrl}/api/user/verify/email`,
        {
          token: verificationToken
        },
        {
          Authorization: `Bearer ${token}`
        }
      )

      if (response.ok) {
        return true
      }

      return false
    } catch {
      return false
    }
  }
}
