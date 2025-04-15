import type React from 'react'

import { getTranslations, setRequestLocale } from 'next-intl/server'
import { MetadataManager } from '@/lib/metadata-manager'
import { protectRoute } from '@/lib/auth/client/protect-route'
import { ChatClientPage } from '../[id]/page.client'
import { cookies } from 'next/headers'
import { ChatAPIManager } from '@/lib/chat'
import { routing, redirect } from '@/lib/i18n/routing'

import type { Metadata } from 'next'
import type { DynamicPageProps } from '@/types/page'

const ChatPage: React.FC<DynamicPageProps> = async ({ params }: DynamicPageProps) => {
  const { locale } = await params
  setRequestLocale(locale)

  const token = protectRoute(await cookies(), locale) as string

  const chat = await ChatAPIManager.get(token, '-1')
  // const chat = await ChatManager.new(token)
  if (chat) {
    return <ChatClientPage token={token} chat={chat} />
  }

  return redirect({
    href: '/',
    locale
  })
}

export const generateMetadata = async ({ params }: DynamicPageProps): Promise<Metadata> => {
  const { locale } = await params

  const t = await getTranslations({
    locale
  })
  return MetadataManager.generate(t('common.loading'), t('chat.description'))
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default ChatPage
