import type React from 'react'

import { ChatClientPage } from '@/app/[locale]/chat/(chat)/page.client'
import { MetadataManager } from '@/lib/metadata-manager'
import { routing } from '@/lib/i18n/routing'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import type { DynamicPageProps } from '@/types/page'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

const ChatPage: React.FC<DynamicPageProps> = async ({ params }: DynamicPageProps) => {
  const { locale } = await params

  setRequestLocale(locale)

  return <ChatClientPage />
}

export const generateMetadata = async ({ params }: DynamicPageProps): Promise<Metadata> => {
  const { locale } = await params

  const t = await getTranslations({
    locale,
    namespace: 'chat'
  })
  return MetadataManager.generate(t('text'), t('description'))
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default ChatPage
