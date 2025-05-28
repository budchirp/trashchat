import type React from 'react'

import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ResendVerificationEmailButton } from './resend-button'
import { MetadataManager } from '@/lib/metadata-manager'
import { authenticatedRoute } from '@/lib/auth/client'
import { Link, redirect } from '@/lib/i18n/routing'
import { UserAPIManager } from '@/lib/api/user'
import { Button } from '@/components/button'
import { cookies } from 'next/headers'

import type { DynamicPageProps } from '@/types/page'
import type { Metadata } from 'next'

const VerifyEmailPage: React.FC<DynamicPageProps> = async ({ params }: DynamicPageProps) => {
  const { locale, token: verificationToken } = await params
  setRequestLocale(locale)

  const token = authenticatedRoute(await cookies())!

  const t = await getTranslations({
    locale
  })

  const user = await UserAPIManager.get({ token, locale })
  if (user && user.isEmailVerified)
    redirect({
      href: '/',
      locale
    })

  const [ok] = await UserAPIManager.verifyEmail({ token, locale }, verificationToken)

  return (
    <div className='w-full page-h-screen mt-4 flex items-center justify-center'>
      <div className='text-center flex flex-col gap-4 items-center justify-center'>
        <h1 className='font-bold text-2xl'>
          {t(ok ? 'auth.verify.verified' : 'auth.verify.invalid-token')}
        </h1>

        {ok ? (
          <Link href='/chat'>
            <Button>{t('common.go-to-chat')}</Button>
          </Link>
        ) : (
          <ResendVerificationEmailButton />
        )}
      </div>
    </div>
  )
}

export const generateMetadata = async ({ params }: DynamicPageProps): Promise<Metadata> => {
  const { locale } = await params

  const t = await getTranslations({
    namespace: 'auth.verify',
    locale
  })
  return MetadataManager.generate(t('text'), t('description'))
}

export default VerifyEmailPage
