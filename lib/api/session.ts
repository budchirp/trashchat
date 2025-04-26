import { CookieMonster } from '@/lib/cookie-monster'
import { CONSTANTS } from '@/lib/constants'
import { Fetch } from '@/lib/fetch'
import { Env } from '@/lib/env'

import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'

export class SessionAPIManager {
  public static delete = async (cookieStore?: ReadonlyRequestCookies): Promise<void> => {
    await Fetch.delete(`${Env.appUrl}/api/session`)

    const cookieMonster = new CookieMonster(cookieStore)
    cookieMonster.delete(CONSTANTS.COOKIES.TOKEN_NAME)
  }

  public static new = async (user: {
    email: string
    password: string
  }): Promise<[boolean, string | null, string | null] | [true, null, string]> => {
    try {
      const response = await Fetch.post<{
        message: string
        data: {
          token: string
        }
      }>(`${Env.appUrl}/api/session`, user)
      const json = await response.json()
      if (response.status < 400) {
        return [true, null, json.data.token]
      }

      return [false, json.message, null]
    } catch {
      return [false, null, null]
    }
  }
}
