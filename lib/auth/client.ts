import { CookieMonster } from '@/lib/cookie-monster'
import { unauthorized } from 'next/navigation'
import { redirect } from '@/lib/i18n/routing'
import { CONSTANTS } from '@/lib/constants'

import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'

export const getToken = (cookieStore: ReadonlyRequestCookies): string | undefined => {
  return new CookieMonster(cookieStore).get(CONSTANTS.COOKIES.TOKEN_NAME)
}

export const authenticatedRoute = (
  cookieStore: ReadonlyRequestCookies,
  redirectTo?: {
    href: string
    locale: string
  }
): string => {
  const token = getToken(cookieStore)
  if (!token) {
    if (redirectTo) {
      redirect(redirectTo)
    }

    return unauthorized()
  }

  return token
}

export const unauthenticatedRoute = (cookieStore: ReadonlyRequestCookies, locale: string): void => {
  const token = getToken(cookieStore)
  if (token) {
    redirect({
      href: '/chat',
      locale
    })
  }
}
