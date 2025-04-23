import type React from 'react'

import { Env } from '@/lib/env'

type VerifyEmailTemplateProps = {
  token: string
}

export const VerifyEmailTemplate: React.FC<VerifyEmailTemplateProps> = ({
  token
}: VerifyEmailTemplateProps) => {
  return (
    <div>
      <h1>Welcome to Trash Chat</h1>
      <p>Please click the link bellow to verify your email.</p>
      <a href={`${Env.appUrl}/en/auth/verify/email/${token}`}>Click here</a>
    </div>
  )
}
