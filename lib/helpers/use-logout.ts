import { use } from 'react'

import { UserContext } from '@/providers/context/user'
import { SessionAPIManager } from '@/lib/api/session'
import { useRouter } from '@/lib/i18n/routing'
import { useTranslations } from 'next-intl'
import { toast } from '@/components/toast'

export const useLogout = (): (() => Promise<void>) => {
  const t = useTranslations('common')

  const router = useRouter()
  const { setUser } = use(UserContext)

  return async () => {
    await SessionAPIManager.delete()

    router.push('/')

    setUser(null)

    toast(t('success'))
  }
}
