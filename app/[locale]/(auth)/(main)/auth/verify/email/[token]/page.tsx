import type React from 'react'

import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ResendVerificationEmailButton } from './resend-button'
import { authenticatedRoute } from '@/lib/auth/client'
import { Link, redirect } from '@/lib/i18n/routing'
import { UserAPIManager } from '@/lib/api/user'
import { Button } from '@/components/button'
import { cookies } from 'next/headers'

import type { DynamicPageProps } from '@/types/page'

const VerifyEmailPage: React.FC<DynamicPageProps> = async ({ params }: DynamicPageProps) => {
  const { locale, token: verificationToken } = await params
  setRequestLocale(locale)

  const token = authenticatedRoute(await cookies(), locale)!

  const t = await getTranslations({
    namespace: 'auth.verify',
    locale
  })

  const t_common = await getTranslations({
    namespace: 'common',
    locale
  })

  const user = await UserAPIManager.get(token)
  if (user && user.verified)
    redirect({
      href: '/',
      locale
    })

  const success = await UserAPIManager.verifyEmail(token, verificationToken)

  return (
    <div className='w-full page-h-screen mt-4 flex items-center justify-center'>
      <div className='text-center flex flex-col gap-4 items-center justify-center'>
        <h1 className='font-bold text-2xl'>{t(success ? 'verified' : 'invalid-token')}</h1>

        {success ? (
          <Link href='/'>
            <Button>{t_common('go-to-home')}</Button>
          </Link>
        ) : (
          <ResendVerificationEmailButton />
        )}
      </div>
    </div>
  )
}

export default VerifyEmailPage
