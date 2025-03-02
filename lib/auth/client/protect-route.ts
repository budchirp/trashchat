import { CONSTANTS } from '@/lib/constants'
import { redirect } from '@/lib/i18n/routing'

import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'

export const protectRoute = (
  cookieStore: ReadonlyRequestCookies,
  locale: string,
  isProtected: boolean = true
): string | undefined => {
  const token = cookieStore.get(CONSTANTS.COOKIES.TOKEN_NAME)?.value
  if (isProtected) {
    if (!token) {
      redirect({
        href: '/',
        locale
      })
    }
  } else {
    if (token) {
      redirect({
        href: '/',
        locale
      })
    }
  }

  return token
}
