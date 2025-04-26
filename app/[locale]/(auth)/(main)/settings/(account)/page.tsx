import type React from 'react'

import { getTranslations, setRequestLocale } from 'next-intl/server'
import { MetadataManager } from '@/lib/metadata-manager'
import { authenticatedRoute } from '@/lib/auth/client'
import { AccountClientPage } from './page.client'
import { Heading } from '@/components/heading'
import { routing } from '@/lib/i18n/routing'
import { cookies } from 'next/headers'

import type { Metadata } from 'next'
import type { DynamicPageProps } from '@/types/page'

const AccountPage: React.FC<DynamicPageProps> = async ({ params }: DynamicPageProps) => {
  const { locale } = await params
  setRequestLocale(locale)

  authenticatedRoute(await cookies(), locale)

  const t = await getTranslations({
    namespace: 'account',
    locale
  })

  return (
    <div className='flex size-full flex-col mt-4'>
      <Heading className='max-md:mt-0'>{t('text')}</Heading>

      <AccountClientPage />
    </div>
  )
}

export const generateMetadata = async ({ params }: DynamicPageProps): Promise<Metadata> => {
  const { locale } = await params

  const t = await getTranslations({
    namespace: 'account',
    locale
  })
  return MetadataManager.generate(t('text'), t('description'))
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default AccountPage
