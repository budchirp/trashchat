'use client'

import type React from 'react'

import { UserAPIManager } from '@/lib/api/user'
import { Button } from '@/components/button'
import { useTranslations } from 'next-intl'
import { toast } from '@/components/toast'
import { CookieMonster } from '@/lib/cookie-monster'
import { CONSTANTS } from '@/lib/constants'

export const ResendVerificationEmailButton: React.FC = (): React.ReactNode => {
  const t = useTranslations()

  const cookieMonster = new CookieMonster()

  return (
    <Button
      type='button'
      onClick={async () => {
        const token = cookieMonster.get(CONSTANTS.COOKIES.TOKEN_NAME)
        if (token) {
          const [ok, message] = await UserAPIManager.sendEmail(token)
          if (ok) {
            toast(t('auth.verify.sent'))
          } else {
            toast(message || t('errors.error'))
          }
        }
      }}
    >
      {t('auth.verify.resend')}
    </Button>
  )
}
