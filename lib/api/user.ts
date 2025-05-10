import { Fetch } from '@/lib/fetch'
import { Env } from '@/lib/env'

import type { User } from '@/types/user'
import type { APIResponse } from '@/types/api'

export class UserAPIManager {
  public static verifyPassword = async (
    token: string,
    password: string
  ): Promise<[true, undefined] | [false, string | null]> => {
    try {
      const response = await Fetch.post<APIResponse>(
        `${Env.appUrl}/api/user/password/verify`,
        {
          password
        },
        {
          Authorization: `Bearer ${token}`
        }
      )

      if (response.ok) return [true, undefined]

      const json = await response.json()
      return [false, json.message]
    } catch {
      return [false, null]
    }
  }

  public static update = async (
    token: string,
    user: Partial<User>
  ): Promise<[true, undefined] | [false, string | null]> => {
    try {
      const response = await Fetch.patch<APIResponse>(`${Env.appUrl}/api/user`, user, {
        Authorization: `Bearer ${token}`
      })

      if (response.ok) return [true, undefined]

      const json = await response.json()
      return [false, json.message]
    } catch {
      return [false, null]
    }
  }

  public static get = async (token: string): Promise<User | null> => {
    try {
      const response = await Fetch.get<APIResponse<User>>(`${Env.appUrl}/api/user`, {
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

  public static delete = async (
    token: string
  ): Promise<[true, undefined] | [false, string | null]> => {
    try {
      const response = await Fetch.delete<APIResponse>(`${Env.appUrl}/api/user`, {
        Authorization: `Bearer ${token}`
      })

      if (response.ok) return [true, undefined]

      const json = await response.json()
      return [false, json.message]
    } catch {
      return [false, null]
    }
  }

  public static new = async (user: {
    name: string
    email: string
    password: string
  }): Promise<[true, undefined] | [false, string | null]> => {
    try {
      const response = await Fetch.post<APIResponse>(`${Env.appUrl}/api/user`, user)

      if (response.ok) {
        return [true, undefined]
      }

      const json = await response.json()
      return [false, json?.message]
    } catch {
      return [false, null]
    }
  }

  public static sendEmail = async (
    token: string
  ): Promise<[true, undefined] | [false, string | null]> => {
    try {
      const response = await Fetch.get<APIResponse>(`${Env.appUrl}/api/user/verify/email`, {
        Authorization: `Bearer ${token}`
      })

      if (response.ok) {
        return [true, undefined]
      }

      const json = await response.json()
      return [false, json?.message]
    } catch {
      return [false, null]
    }
  }

  public static verifyEmail = async (
    token: string,
    verificationToken: string
  ): Promise<[true, undefined] | [false, string | null]> => {
    try {
      const response = await Fetch.post<APIResponse>(
        `${Env.appUrl}/api/user/verify/email`,
        {
          token: verificationToken
        },
        {
          Authorization: `Bearer ${token}`
        }
      )

      if (response.ok) {
        return [true, undefined]
      }

      const json = await response.json()
      return [false, json?.message]
    } catch {
      return [false, null]
    }
  }
}
