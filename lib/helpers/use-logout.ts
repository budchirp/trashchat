'use client'

import { use } from 'react'

import { UserContext } from '@/providers/context/user'
import { SessionAPIManager } from '@/lib/api/session'
import { useLocale, useTranslations } from 'next-intl'
import { toast } from '@/components/toast'

export const useLogout = (): ((token: string) => Promise<void>) => {
  const locale = useLocale()
  const t = useTranslations('common')

  const { setUser } = use(UserContext)
  return async (token) => {
    toast(t('loading'))

    await SessionAPIManager.delete(
      {
        locale,
        token
      },
      {}
    )

    setUser(null)

    toast(t('success'))

    window?.location?.replace(`/${locale}`)
  }
}
