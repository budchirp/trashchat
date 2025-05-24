import type React from 'react'

import { getTranslations, setRequestLocale } from 'next-intl/server'
import { UserContextProvider } from '@/providers/user'
import { SessionAPIManager } from '@/lib/api/session'
import { UserAPIManager } from '@/lib/api/user'
import { getToken } from '@/lib/auth/client'
import { cookies } from 'next/headers'

import ErrorPage from '@/app/[locale]/error'

import type { DynamicLayoutProps } from '@/types/layout'

const Layout: React.FC<DynamicLayoutProps> = async ({ children, params }: DynamicLayoutProps) => {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale })

  const token = getToken(await cookies())
  if (token) {
    const [ok, message] = await SessionAPIManager.verify({
      locale,
      token
    })

    if (!ok) {
      return <ErrorPage error={{ message: message || t('errors.error') }} />
    }

    const user = await UserAPIManager.get({ token, locale })
    return (
      <UserContextProvider token={token} initialUser={user}>
        {children}
      </UserContextProvider>
    )
  }

  return children
}

export default Layout
