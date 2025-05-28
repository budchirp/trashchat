import type React from 'react'

import { Env } from '@/lib/env'

type PasswordResetTemplateProps = {
  token: string
  t: (key: string) => string
}

export const PasswordResetTemplate: React.FC<PasswordResetTemplateProps> = ({
  token,
  t
}: PasswordResetTemplateProps) => (
  <div>
    <h1>{t('email.password-reset.title')}</h1>
    <p>{t('email.password-reset.description')}</p>
    <a href={`${Env.appUrl}/en/auth/password/reset/${token}`}>{t('email.password-reset.button')}</a>
  </div>
)
