import { Fetch } from '@/lib/fetch'
import { Env } from '@/lib/env'

import type { User } from '@/types/user'
import type { APIResponse } from '@/types/api'

export type Metadata = {
  token: string
  locale?: string
}

export class UserAPIManager {
  public static verifyPassword = async (
    metadata: Metadata,
    password: string
  ): Promise<[true, undefined] | [false, string | null]> => {
    try {
      const response = await Fetch.post<APIResponse>(
        `${Env.appUrl}/api/user/password/verify`,
        {
          password
        },
        {
          authorization: `Bearer ${metadata.token}`,
          'accept-language': metadata.locale || 'en'
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
    metadata: Metadata,
    user: Partial<User>
  ): Promise<[true, undefined] | [false, string | null]> => {
    try {
      const response = await Fetch.patch<APIResponse>(`${Env.appUrl}/api/user`, user, {
        authorization: `Bearer ${metadata.token}`,
        'accept-language': metadata.locale || 'en'
      })

      if (response.ok) return [true, undefined]

      const json = await response.json()
      return [false, json.message]
    } catch {
      return [false, null]
    }
  }

  public static get = async (metadata: Metadata): Promise<User | null> => {
    try {
      const response = await Fetch.get<APIResponse<User>>(`${Env.appUrl}/api/user`, {
        authorization: `Bearer ${metadata.token}`,
        'accept-language': metadata.locale || 'en'
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
    metadata: Metadata
  ): Promise<[true, undefined] | [false, string | null]> => {
    try {
      const response = await Fetch.delete<APIResponse>(`${Env.appUrl}/api/user`, {
        authorization: `Bearer ${metadata.token}`,
        'accept-language': metadata.locale || 'en'
      })

      if (response.ok) return [true, undefined]

      const json = await response.json()
      return [false, json.message]
    } catch {
      return [false, null]
    }
  }

  public static new = async (
    metadata: Partial<Metadata>,
    user: {
      name: string
      email: string
      password: string
    }
  ): Promise<[true, undefined] | [false, string | null]> => {
    try {
      const response = await Fetch.post<APIResponse>(`${Env.appUrl}/api/user`, user, {
        'accept-language': metadata.locale || 'en'
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

  public static sendEmail = async (
    metadata: Metadata
  ): Promise<[true, undefined] | [false, string | null]> => {
    try {
      const response = await Fetch.get<APIResponse>(`${Env.appUrl}/api/user/verify/email`, {
        authorization: `Bearer ${metadata.token}`,
        'accept-language': metadata.locale || 'en'
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
    metadata: Metadata,
    verificationToken: string
  ): Promise<[true, undefined] | [false, string | null]> => {
    try {
      const response = await Fetch.post<APIResponse>(
        `${Env.appUrl}/api/user/verify/email`,
        {
          token: verificationToken
        },
        {
          authorization: `Bearer ${metadata.token}`,
          'accept-language': metadata.locale || 'en'
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
