import type React from 'react'

import { ChatClientPage } from '@/app/[locale]/chat/(chat)/page.client'
import { MetadataManager } from '@/lib/metadata-manager'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { unstable_noStore as noStore } from 'next/cache'

import type { DynamicPageProps } from '@/types/page'
import type { Metadata } from 'next'

const ChatPage: React.FC<DynamicPageProps> = async ({ params }: DynamicPageProps) => {
  const { locale } = await params

  noStore()
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

export default ChatPage
