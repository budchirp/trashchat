import type React from 'react'

import { getTranslations, setRequestLocale } from 'next-intl/server'
import { VerticalPage } from '@/components/vertical-page'
import { MetadataManager } from '@/lib/metadata-manager'
import { Container } from '@/components/container'
import { routing } from '@/lib/i18n/routing'

import type { Metadata } from 'next'
import type { DynamicPageProps } from '@/types/page'

const NotFound: React.FC<DynamicPageProps> = async ({ params }: DynamicPageProps) => {
  const { locale } = (await params) || {
    locale: 'en'
  }
  setRequestLocale(locale)

  const t = await getTranslations({
    namespace: 'chat',
    locale
  })

  return (
    <Container>
      <VerticalPage items={t('errors.not-found').split(' ')} title={'404'} />
    </Container>
  )
}

export const generateMetadata = async ({ params }: DynamicPageProps): Promise<Metadata> => {
  const { locale, id } = await params

  const t = await getTranslations({
    namespace: 'chat',
    locale
  })

  return MetadataManager.generate('404', t('errors.not-found'))
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export { NotFound as ChatNotFoundPage }
export default NotFound
