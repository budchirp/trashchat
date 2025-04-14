import type React from 'react'

import { ChatClientPage } from '@/app/[locale]/chat/[id]/page.client'
import { MetadataManager } from '@/lib/metadata-manager'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { cookies } from 'next/headers'
import { protectRoute } from '@/lib/auth/client/protect-route'
import { notFound } from 'next/navigation'
import { ChatManager } from '@/lib/chat'

import type { DynamicPageProps } from '@/types/page'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const ChatPage: React.FC<DynamicPageProps> = async ({ params }: DynamicPageProps) => {
  const { locale, id } = await params
  setRequestLocale(locale)

  const token = protectRoute(await cookies(), locale) as string

  const chat = await ChatManager.get(token, id)
  if (!chat) return notFound()

  return <ChatClientPage token={token} chat={chat} />
}

export const generateMetadata = async ({ params }: DynamicPageProps): Promise<Metadata> => {
  const { locale, id } = await params

  const t = await getTranslations({
    namespace: 'chat',
    locale
  })

  const token = protectRoute(await cookies(), locale) as string

  const chat = await ChatManager.get(token, id)
  if (!chat) notFound()

  return MetadataManager.generate(chat.title, t('description'))
}

export default ChatPage
