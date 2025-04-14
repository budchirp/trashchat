import { CONSTANTS } from '@/lib/constants'
import { CookieMonster } from '@/lib/cookie-monster'
import { redirect } from '@/lib/i18n/routing'
import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'

export const protectRoute = (
  cookieStore: ReadonlyRequestCookies,
  locale: string,
  isProtected: boolean = true
): string | undefined => {
  const cookieMonster = new CookieMonster(cookieStore)
  const token = cookieMonster.get(CONSTANTS.COOKIES.TOKEN_NAME)
  if (isProtected) {
    if (!token) {
      redirect({
        href: '/auth/signin',
        locale
      })
    }
  }

  return token
}
