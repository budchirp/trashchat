import type React from 'react'

import { VerticalPage } from '@/components/vertical-page'
import { MetadataManager } from '@/lib/metadata-manager'
import { routing } from '@/lib/i18n/routing'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Container } from '@/components/container'

import type { Metadata } from 'next'
import type { DynamicPageProps } from '@/types/page'

const NotFound: React.FC<DynamicPageProps> = async ({ params }: DynamicPageProps) => {
  const { locale } = await params

  setRequestLocale(locale)

  const t = await getTranslations('chat')
  return (
    <Container>
      <VerticalPage items={t('not-found').split(' ')} title={'404'} />
    </Container>
  )
}

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations('common')

  return MetadataManager.generate(t('not-found'), '404')
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default NotFound
