import type React from 'react'

import SignUpClientPage from '@/app/[locale]/(main)/auth/signup/page.client'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { MetadataManager } from '@/lib/metadata-manager'
import { routing } from '@/lib/i18n/routing'
import { protectRoute } from '@/lib/auth/client/protect-route'
import { cookies } from 'next/headers'

import type { Metadata } from 'next'
import type { DynamicPageProps } from '@/types/page'

const SignUpPage: React.FC<DynamicPageProps> = async ({ params }: DynamicPageProps) => {
  const { locale } = await params
  setRequestLocale(locale)

  protectRoute(await cookies(), locale, false)

  const t = await getTranslations('auth.signup')
  return (
    <div className='flex size-full flex-col mt-4'>
      <div className='w-full page-h-screen flex items-center justify-center'>
        <div className='text-center flex flex-col w-full gap-16 items-center justify-center'>
          <h1 className='font-bold text-2xl'>{t('text')}</h1>

          <SignUpClientPage />
        </div>
      </div>
    </div>
  )
}

export const generateMetadata = async ({ params }: DynamicPageProps): Promise<Metadata> => {
  const { locale } = await params

  const t = await getTranslations({
    locale,
    namespace: 'auth.signup'
  })
  return MetadataManager.generate(t('text'), t('description'))
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default SignUpPage
