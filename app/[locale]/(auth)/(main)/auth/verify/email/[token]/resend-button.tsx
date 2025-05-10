'use client'

import type React from 'react'

import { CookieMonster } from '@/lib/cookie-monster'
import { UserAPIManager } from '@/lib/api/user'
import { Button } from '@/components/button'
import { useLocale, useTranslations } from 'next-intl'
import { CONSTANTS } from '@/lib/constants'
import { toast } from '@/components/toast'

export const ResendVerificationEmailButton: React.FC = (): React.ReactNode => {
  const locale = useLocale()
  const t = useTranslations()

  const cookieMonster = new CookieMonster()

  return (
    <Button
      type='button'
      onClick={async () => {
        const token = cookieMonster.get(CONSTANTS.COOKIES.TOKEN_NAME)
        if (token) {
          const [ok, message] = await UserAPIManager.sendEmail({ token, locale })
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
