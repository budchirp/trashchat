import type React from 'react'

import { getTranslations, setRequestLocale } from 'next-intl/server'
import { UserContextProvider } from '@/providers/user'
import { SessionAPIManager } from '@/lib/api/session'
import { UserAPIManager } from '@/lib/api/user'
import { redirect } from '@/lib/i18n/routing'
import { getToken } from '@/lib/auth/client'
import { cookies } from 'next/headers'

import type { DynamicLayoutProps } from '@/types/layout'

const Layout: React.FC<DynamicLayoutProps> = async ({ children, params }: DynamicLayoutProps) => {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({
    locale
  })

  const token = getToken(await cookies())
  if (token) {
    const user = await UserAPIManager.get({ token, locale })
    if (!user) {
      await SessionAPIManager.delete({
        locale
      })

      return redirect({
        locale,
        href: `/?${Math.random()}`
      })
    }

    return (
      <UserContextProvider token={token} initialUser={user}>
        {children}
      </UserContextProvider>
    )
  }

  return children
}

export default Layout
