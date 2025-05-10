import type React from 'react'

import { getTranslations, setRequestLocale } from 'next-intl/server'
import { MetadataManager } from '@/lib/metadata-manager'
import { authenticatedRoute } from '@/lib/auth/client'
import { ChatClientPage } from '../[id]/page.client'
import { ChatAPIManager } from '@/lib/api/chat'
import { notFound } from 'next/navigation'
import { routing } from '@/lib/i18n/routing'
import { cookies } from 'next/headers'

import type { Metadata } from 'next'
import type { DynamicPageProps } from '@/types/page'

const ChatPage: React.FC<DynamicPageProps> = async ({ params }: DynamicPageProps) => {
  const { locale } = await params
  setRequestLocale(locale)

  const token = authenticatedRoute(await cookies(), locale)
  const chat = await ChatAPIManager.get({ token, locale }, '-1')
  if (!chat) return notFound()

  return <ChatClientPage token={token} chat={chat} />
}

export const generateMetadata = async ({ params }: DynamicPageProps): Promise<Metadata> => {
  const { locale } = await params

  const t = await getTranslations({
    namespace: 'chat',
    locale
  })

  const token = authenticatedRoute(await cookies(), locale)
  const chat = await ChatAPIManager.get({ token, locale }, '-1')
  if (!chat) notFound()

  return MetadataManager.generate(chat.title, t('description'))
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default ChatPage
