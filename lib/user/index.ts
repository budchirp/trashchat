import { Fetch } from '@/lib/fetch'
import { Env } from '@/lib/env'

import type { User } from '@/types/user'

export class UserAPIManager {
  public static verify = async (
    token: string,
    password: string
  ): Promise<[boolean, string | null]> => {
    try {
      const response = await Fetch.post<{
        message: string
      }>(
        `${Env.appUrl}/api/user/verify`,
        {
          password
        },
        {
          Authorization: `Bearer ${token}`
        }
      )

      if (response.status < 400) return [true, null]

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

      if (response.status < 400) return [true, null]

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

      if (response.status < 400) {
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

      if (response.status < 400) return [true, null]

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

      if (response.status < 400) {
        return [true, null]
      }

      const json = await response.json()
      return [false, json?.message]
    } catch {
      return [false, null]
    }
  }
}
