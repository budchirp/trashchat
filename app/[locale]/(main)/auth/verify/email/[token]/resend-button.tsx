'use client'

import type React from 'react'

import { Button } from '@/components/button'
import { UserAPIManager } from '@/lib/api/user'
import { useTranslations } from 'next-intl'
import { toast } from '@/lib/toast'

type ResendVerificationEmailButtonProps = {
  token: string
}

export const ResendVerificationEmailButton: React.FC<ResendVerificationEmailButtonProps> = ({
  token
}: ResendVerificationEmailButtonProps): React.ReactNode => {
  const t = useTranslations('auth.verify')

  return (
    <Button
      type='button'
      onClick={async () => {
        await UserAPIManager.sendEmail(token)

        toast(t('sent'))
      }}
    >
      {t('resend')}
    </Button>
  )
}
