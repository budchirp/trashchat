import type React from 'react'

import { getTranslations, setRequestLocale } from 'next-intl/server'
import { unauthenticatedRoute } from '@/lib/auth/client'
import { MetadataManager } from '@/lib/metadata-manager'
import { routing } from '@/lib/i18n/routing'
import { Button } from '@/components/button'
import { Link } from '@/lib/i18n/routing'
import { Logo } from '@/components/logo'
import { cookies } from 'next/headers'

import type { Metadata } from 'next'
import type { DynamicPageProps } from '@/types/page'

const LandingPage: React.FC<DynamicPageProps> = async ({ params }: DynamicPageProps) => {
  const { locale } = await params
  setRequestLocale(locale)

  unauthenticatedRoute(await cookies(), locale)

  const t = await getTranslations({
    locale
  })

  return (
    <div className='w-full page-h-screen mt-4 flex items-center justify-center'>
      <div className='text-center flex flex-col gap-4 items-center justify-center'>
        <div className='text-lg flex items-center justify-center text-center gap-1 flex-col font-medium'>
          <Logo />

          <p className=''>{t('landing.description')}</p>
        </div>

        <div className='flex items-center justify-center gap-2'>
          <Link href='/auth/signin'>
            <Button>{t('auth.signin.text')}</Button>
          </Link>

          <Link href='/auth/signup'>
            <Button color='secondary'>{t('auth.signup.text')}</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export const generateMetadata = async ({ params }: DynamicPageProps): Promise<Metadata> => {
  const { locale } = await params

  const t = await getTranslations({
    namespace: 'landing',
    locale
  })
  return MetadataManager.generate(t('text'), t('description'))
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default LandingPage
