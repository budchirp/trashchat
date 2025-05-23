import { CookieMonster } from '@/lib/cookie-monster'
import { CONSTANTS } from '@/lib/constants'
import { Fetch } from '@/lib/fetch'
import { Env } from '@/lib/env'

import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'
import type { APIHeaders, UnprotectedAPIHeaders } from '@/types/api-headers'
import type { APIResponse } from '@/types/api'

export class SessionAPIManager {
  public static delete = async (
    headers: Omit<APIHeaders, 'token'> & { token?: string },
    options: {
      token_id?: string
      cookieStore?: ReadonlyRequestCookies
    }
  ): Promise<void> => {
    const cookieMonster = new CookieMonster(options.cookieStore)

    if (headers.token) {
      await Fetch.delete(`${Env.appUrl}/api/session?token_id=${options.token_id}`, {
        'accept-language': headers.locale || 'en',
        authorization: `Bearer ${headers.token}`
      })
    }

    cookieMonster.delete(CONSTANTS.COOKIES.TOKEN_NAME)
  }

  public static verify = async (
    headers: APIHeaders
  ): Promise<[true, undefined] | [false, string | null]> => {
    try {
      const response = await Fetch.post<APIResponse>(
        `${Env.appUrl}/api/session/verify`,
        {},
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

  public static new = async (
    headers: UnprotectedAPIHeaders,
    user: {
      email: string
      password: string
    }
  ): Promise<[boolean, string | null, string | null] | [true, undefined, string]> => {
    try {
      const response = await Fetch.post<
        APIResponse<{
          token: string
        }>
      >(`${Env.appUrl}/api/session`, user, {
        'accept-language': headers.locale || 'en'
      })
      const json = await response.json()
      if (response.status < 400) {
        return [true, undefined, json.data.token]
      }

      return [false, json.message, null]
    } catch {
      return [false, null, null]
    }
  }
}
