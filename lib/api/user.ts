import { SessionAPIManager } from '@/lib/api/session'
import { Fetch } from '@/lib/fetch'
import { Env } from '@/lib/env'

import type { User } from '@/types/user'
import type { APIResponse } from '@/types/api'
import type { APIHeaders, UnprotectedAPIHeaders } from '@/types/api-headers'

export class UserAPIManager {
  public static verifyPassword = async (
    headers: APIHeaders,
    password: string
  ): Promise<[true, undefined, string] | [false, string | null, undefined]> => {
    try {
      const response = await Fetch.post<
        APIResponse<{
          verificationToken: string
        }>
      >(
        `${Env.appUrl}/api/user/password/verify`,
        {
          password
        },
        {
          authorization: `Bearer ${headers.token}`,
          'accept-language': headers.locale || 'en'
        }
      )

      const json = await response.json()
      if (response.ok) return [true, undefined, json.data.verificationToken]

      return [false, json.message, undefined]
    } catch {
      return [false, null, undefined]
    }
  }

  public static update = async (
    headers: APIHeaders,
    user: Partial<User> | any
  ): Promise<[true, undefined] | [false, string | null]> => {
    try {
      const response = await Fetch.patch<APIResponse>(`${Env.appUrl}/api/user`, user, {
        authorization: `Bearer ${headers.token}`,
        'accept-language': headers.locale || 'en'
      })

      if (response.ok) return [true, undefined]

      const json = await response.json()
      return [false, json.message]
    } catch {
      return [false, null]
    }
  }

  public static updatePassword = async (
    headers: APIHeaders,
    values: {
      password: string
      newPassword: string
    }
  ): Promise<[true, undefined] | [false, string | null]> => {
    try {
      const response = await Fetch.patch<APIResponse>(`${Env.appUrl}/api/user/password`, values, {
        authorization: `Bearer ${headers.token}`,
        'accept-language': headers.locale || 'en'
      })

      if (response.ok) return [true, undefined]

      const json = await response.json()
      return [false, json.message]
    } catch {
      return [false, null]
    }
  }

  public static get = async (headers: APIHeaders): Promise<User | null> => {
    try {
      const response = await Fetch.get<APIResponse<User>>(`${Env.appUrl}/api/user`, {
        authorization: `Bearer ${headers.token}`,
        'accept-language': headers.locale || 'en'
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
    headers: APIHeaders,
    verificationToken: string
  ): Promise<[true, undefined] | [false, string | null]> => {
    try {
      const response = await Fetch.delete<APIResponse>(
        `${Env.appUrl}/api/user?verificationToken=${verificationToken}`,
        {
          authorization: `Bearer ${headers.token}`,
          'accept-language': headers.locale || 'en'
        }
      )

      if (response.ok) {
        await SessionAPIManager.delete({ locale: headers.locale }, {})

        return [true, undefined]
      }

      const json = await response.json()
      return [false, json.message]
    } catch {
      return [false, null]
    }
  }

  public static new = async (
    headers: Partial<APIHeaders>,
    user: {
      name: string
      email: string
      password: string
    }
  ): Promise<[true, undefined] | [false, string | null]> => {
    try {
      const response = await Fetch.post<APIResponse>(`${Env.appUrl}/api/user`, user, {
        'accept-language': headers.locale || 'en'
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

  public static sendVerifyEmail = async (
    headers: APIHeaders
  ): Promise<[true, undefined] | [false, string | null]> => {
    try {
      const response = await Fetch.get<APIResponse>(`${Env.appUrl}/api/user/email/verify`, {
        authorization: `Bearer ${headers.token}`,
        'accept-language': headers.locale || 'en'
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
    headers: APIHeaders,
    verificationToken: string
  ): Promise<[true, undefined] | [false, string | null]> => {
    try {
      const response = await Fetch.post<APIResponse>(
        `${Env.appUrl}/api/user/email/verify`,
        {
          token: verificationToken
        },
        {
          authorization: `Bearer ${headers.token}`,
          'accept-language': headers.locale || 'en'
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

  public static sendResetPasswordEmail = async (
    headers: UnprotectedAPIHeaders,
    email: string
  ): Promise<[true, undefined] | [false, string | null]> => {
    try {
      const response = await Fetch.post<APIResponse>(
        `${Env.appUrl}/api/user/password/reset`,
        {
          email
        },
        {
          'accept-language': headers.locale || 'en'
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

  public static resetPassword = async (
    headers: UnprotectedAPIHeaders,
    verificationToken: string,
    password: string
  ): Promise<[true, undefined] | [false, string | null]> => {
    try {
      const response = await Fetch.post<APIResponse>(
        `${Env.appUrl}/api/user/password/reset/verify`,
        {
          token: verificationToken,
          password
        },
        {
          'accept-language': headers.locale || 'en'
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
