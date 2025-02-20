import type React from 'react'

import { ChatClientPage } from '@/app/[locale]/chat/(chat)/page.client'
import { MetadataManager } from '@/lib/metadata-manager'
import { getTranslations } from 'next-intl/server'

import type { Metadata } from 'next'

const ChatPage: React.FC = (): React.ReactNode => {
  return <ChatClientPage />
}

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations('chat')

  return MetadataManager.generate(t('text'), t('description'))
}

export default ChatPage
