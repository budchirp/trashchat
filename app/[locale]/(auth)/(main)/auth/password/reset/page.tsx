import type React from 'react'

import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ResetPasswordSendMailClientPage } from './page.client'
import { MetadataManager } from '@/lib/metadata-manager'
import { routing } from '@/lib/i18n/routing'

import type { DynamicPageProps } from '@/types/page'
import type { Metadata } from 'next'

const ResetPasswordSendMailPage: React.FC<DynamicPageProps> = async ({
  params
}: DynamicPageProps) => {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({
    namespace: 'auth.reset-password',
    locale
  })

  return (
    <div className='w-full page-min-h-screen mt-4 flex-col gap-4 flex items-center justify-center'>
      <div className='flex flex-col gap-1 text-center items-center'>
        <h1 className='font-bold text-2xl'>{t('text')}</h1>

        <h2 className='text-sm text-text-tertiary'>{t('step-1')}</h2>
      </div>

      <ResetPasswordSendMailClientPage />
    </div>
  )
}

export const generateMetadata = async ({ params }: DynamicPageProps): Promise<Metadata> => {
  const { locale } = await params

  const t = await getTranslations({
    namespace: 'auth.reset-password',
    locale
  })
  return MetadataManager.generate(t('text'), t('description'))
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default ResetPasswordSendMailPage
