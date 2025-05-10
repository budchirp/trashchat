import type React from 'react'

import { getTranslations, setRequestLocale } from 'next-intl/server'
import { MetadataManager } from '@/lib/metadata-manager'
import { authenticatedRoute } from '@/lib/auth/client'
import { PaymentPageClient } from './page.client'
import { Heading } from '@/components/heading'
import { routing } from '@/lib/i18n/routing'
import { cookies } from 'next/headers'

import { CONSTANTS } from '@/lib/constants'
import { Env } from '@/lib/env'

import type { Metadata } from 'next'
import type { DynamicPageProps } from '@/types/page'

const PaymentPage: React.FC<DynamicPageProps> = async ({ params }: DynamicPageProps) => {
  const { locale } = await params
  setRequestLocale(locale)

  authenticatedRoute(await cookies(), locale)

  return (
    <div className='flex size-full flex-col mt-4'>
      <Heading
        description={
          <h2 className='text-lg text-text-tertiary'>
            $<span className='font-medium'>{CONSTANTS.PLUS_PRICE}</span>
          </h2>
        }
      >
        {Env.appName} plus
      </Heading>

      <div className='flex items-center justify-center w-full'>
        <PaymentPageClient />
      </div>
    </div>
  )
}

export const generateMetadata = async ({ params }: DynamicPageProps): Promise<Metadata> => {
  const { locale } = await params

  const t = await getTranslations({
    namespace: 'subscribe.payment',
    locale
  })
  return MetadataManager.generate(t('text'), t('description'))
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default PaymentPage
