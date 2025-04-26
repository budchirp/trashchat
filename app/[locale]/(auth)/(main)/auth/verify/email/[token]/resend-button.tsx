'use client'

import type React from 'react'

import { UserAPIManager } from '@/lib/api/user'
import { Button } from '@/components/button'
import { useTranslations } from 'next-intl'
import { toast } from '@/components/toast'
import { CookieMonster } from '@/lib/cookie-monster'
import { CONSTANTS } from '@/lib/constants'

export const ResendVerificationEmailButton: React.FC = (): React.ReactNode => {
  const t = useTranslations('auth.verify')

  const cookieMonster = new CookieMonster()

  return (
    <Button
      type='button'
      onClick={async () => {
        const token = cookieMonster.get(CONSTANTS.COOKIES.TOKEN_NAME)
        if (token) {
          await UserAPIManager.sendEmail(token)

          toast(t('sent'))
        }
      }}
    >
      {t('resend')}
    </Button>
  )
}
