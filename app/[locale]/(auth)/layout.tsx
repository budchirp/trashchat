import type React from 'react'

import { setRequestLocale } from 'next-intl/server'
import { UserContextProvider } from '@/providers/user'
import { UserAPIManager } from '@/lib/api/user'
import { getToken } from '@/lib/auth/client'
import { cookies } from 'next/headers'

import type { DynamicLayoutProps } from '@/types/layout'

const Layout: React.FC<DynamicLayoutProps> = async ({ children, params }: DynamicLayoutProps) => {
  const { locale } = await params
  setRequestLocale(locale)

  const token = getToken(await cookies())
  if (token) {
    const user = await UserAPIManager.get({ token, locale })
    if (!user) {
      throw new Error('token')
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
