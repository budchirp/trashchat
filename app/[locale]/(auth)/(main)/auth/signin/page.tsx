import type React from 'react'

import { getTranslations, setRequestLocale } from 'next-intl/server'
import { MetadataManager } from '@/lib/metadata-manager'
import { unauthenticatedRoute } from '@/lib/auth/client'
import { Link, routing } from '@/lib/i18n/routing'
import { SignInClientPage } from './page.client'
import { cookies } from 'next/headers'

import type { Metadata } from 'next'
import type { DynamicPageProps } from '@/types/page'

const SignInPage: React.FC<DynamicPageProps> = async ({ params }: DynamicPageProps) => {
  const { locale } = await params
  setRequestLocale(locale)

  unauthenticatedRoute(await cookies(), locale)

  const t = await getTranslations({
    namespace: 'auth.signin',
    locale
  })

  return (
    <div className='w-full page-h-screen mt-4 flex-col gap-8 flex items-center justify-center'>
      <div className='flex flex-col gap-1 text-center items-center'>
        <h1 className='font-bold text-2xl'>{t('text')}</h1>

        <Link href='/auth/signup' className='text-sm underline text-text-tertiary'>
          {t('signup')}
        </Link>
      </div>

      <SignInClientPage />
    </div>
  )
}

export const generateMetadata = async ({ params }: DynamicPageProps): Promise<Metadata> => {
  const { locale } = await params

  const t = await getTranslations({
    namespace: 'auth.signin',
    locale
  })
  return MetadataManager.generate(t('text'), t('description'))
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default SignInPage
