import type React from 'react'

import { getTranslations, setRequestLocale } from 'next-intl/server'
import { authenticatedRoute } from '@/lib/auth/client'
import { Link, redirect } from '@/lib/i18n/routing'
import { UserAPIManager } from '@/lib/api/user'
import { Button } from '@/components/button'
import { cookies } from 'next/headers'

import type { DynamicPageProps } from '@/types/page'

const PaymentSuccessfullPage: React.FC<DynamicPageProps> = async ({ params }: DynamicPageProps) => {
  const { locale } = await params
  setRequestLocale(locale)

  const token = authenticatedRoute(await cookies(), locale)!

  const t = await getTranslations({
    locale
  })

  const user = await UserAPIManager.get({ token, locale })
  if (!user?.subscription)
    redirect({
      href: '/',
      locale
    })

  return (
    <div className='w-full page-h-screen mt-4 flex items-center justify-center'>
      <div className='text-center flex flex-col gap-4 items-center justify-center'>
        <h1 className='font-bold text-2xl'>{t('subscribe.payment.success')}</h1>

        <Link href='/chat'>
          <Button>{t('common.go-to-chat')}</Button>
        </Link>
      </div>
    </div>
  )
}

export default PaymentSuccessfullPage
