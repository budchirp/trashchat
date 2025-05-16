import type React from 'react'

import { getTranslations, setRequestLocale } from 'next-intl/server'
import { MetadataManager } from '@/lib/metadata-manager'
import { Markdown } from '@/components/markdown'
import { Heading } from '@/components/heading'
import { routing } from '@/lib/i18n/routing'

import type { Metadata } from 'next'
import type { DynamicPageProps } from '@/types/page'

const TermsOfServicePage: React.FC<DynamicPageProps> = async ({ params }: DynamicPageProps) => {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({
    namespace: 'legal.terms-of-service',
    locale
  })

  return (
    <div className='flex size-full flex-col mt-4'>
      <Heading>{t('text')}</Heading>

      <article className='prose dark:prose-dark max-w-full! text-text-primary'>
        <Markdown content={t('policy')} />
      </article>
    </div>
  )
}

export const generateMetadata = async ({ params }: DynamicPageProps): Promise<Metadata> => {
  const { locale } = await params

  const t = await getTranslations({
    namespace: 'legal.terms-of-service',
    locale
  })
  return MetadataManager.generate(t('text'), t('description'))
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default TermsOfServicePage
