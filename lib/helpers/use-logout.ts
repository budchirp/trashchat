import { use } from 'react'

import { UserContext } from '@/providers/context/user'
import { SessionAPIManager } from '@/lib/api/session'
import { useTranslations } from 'next-intl'
import { toast } from '@/components/toast'

export const useLogout = (): (() => Promise<void>) => {
  const t = useTranslations('common')

  const { setUser } = use(UserContext)
  return async () => {
    await SessionAPIManager.delete()

    setUser(null)

    toast(t('success'))

    window?.location?.replace(new URL('/', window.location.origin))
  }
}
