import { Button } from '@/components/button'
import { UserAPIManager } from '@/lib/api/user'
import { protectRoute } from '@/lib/auth/client/protect-route'
import { Link, redirect } from '@/lib/i18n/routing'
import type { DynamicPageProps } from '@/types/page'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { cookies } from 'next/headers'
import type React from 'react'
import { ResendVerificationEmailButton } from './resend-button'

const VerifyEmailPage: React.FC<DynamicPageProps> = async ({ params }: DynamicPageProps) => {
  const { locale, token: verificationToken } = await params
  setRequestLocale(locale)

  const token = protectRoute(await cookies(), locale) as string

  const t = await getTranslations({
    namespace: 'auth.verify',
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
    <div className='flex size-full flex-col mt-4'>
      <div className='w-full page-h-screen flex-col gap-8 flex items-center justify-center'>
        <div className='text-center flex flex-col gap-4 items-center justify-center'>
          <h1 className='font-bold text-2xl'>{t(success ? 'verified' : 'invalid-token')}</h1>

          {success ? (
            <Link href='/'>
              <Button>{t('go-to-home')}</Button>
            </Link>
          ) : (
            <ResendVerificationEmailButton token={token} />
          )}
        </div>
      </div>
    </div>
  )
}

export default VerifyEmailPage
