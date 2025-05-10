import type React from 'react'

import { Env } from '@/lib/env'

type VerifyEmailTemplateProps = {
  token: string
  t: (key: string) => string
}

export const VerifyEmailTemplate: React.FC<VerifyEmailTemplateProps> = ({
  token,
  t
}: VerifyEmailTemplateProps) => (
  <div>
    <h1>{t('email.verify.title')}</h1>
    <p>{t('email.verify.description')}</p>
    <a href={`${Env.appUrl}/en/auth/verify/email/${token}`}>{t('email.verify.button')}</a>
  </div>
)
