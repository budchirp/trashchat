import type React from 'react'

import { ChatClientPage } from '@/app/[locale]/chat/[id]/page.client'
import { MetadataManager } from '@/lib/metadata-manager'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { cookies } from 'next/headers'
import { protectRoute } from '@/lib/auth/client/protect-route'
import { Env } from '@/lib/env'
import { Fetch } from '@/lib/fetch'
import { notFound } from 'next/navigation'

import type { DynamicPageProps } from '@/types/page'
import type { Metadata } from 'next'
import type { Chat } from '@/types/chat'

export const dynamic = 'force-dynamic'

const ChatPage: React.FC<DynamicPageProps> = async ({ params }: DynamicPageProps) => {
  const { locale, id } = await params
  setRequestLocale(locale)

  const token = protectRoute(await cookies(), locale) as string

  const response = await Fetch.get<{
    data: Chat
  }>(`${Env.appUrl}/api/chat/${id}`, {
    Authorization: `Bearer ${token}`
  })

  if (response.status >= 400) {
    notFound()
  }

  const json = await response.json()
  return (
    <ChatClientPage
      token={token}
      chatId={id}
      initialMessages={(json?.data?.messages as any) || []}
    />
  )
}

export const generateMetadata = async ({ params }: DynamicPageProps): Promise<Metadata> => {
  const { locale, id } = await params

  const t = await getTranslations({
    namespace: 'chat',
    locale
  })

  const token = protectRoute(await cookies(), locale) as string

  const response = await Fetch.get<{
    data: Chat
  }>(`${Env.appUrl}/api/chat/${id}`, {
    Authorization: `Bearer ${token}`
  })

  if (response.status >= 400) {
    notFound()
  }

  const json = await response.json()
  return MetadataManager.generate(json.data.title, t('description'))
}

export default ChatPage
