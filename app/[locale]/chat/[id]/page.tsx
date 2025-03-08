import type React from 'react'

import { ChatClientPage } from '@/app/[locale]/chat/[id]/page.client'
import { MetadataManager } from '@/lib/metadata-manager'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { cookies } from 'next/headers'
import { protectRoute } from '@/lib/auth/client/protect-route'
import { Env } from '@/lib/env'
import { Fetch } from '@/lib/fetch'
import { redirect } from '@/lib/i18n/routing'

import type { DynamicPageProps } from '@/types/page'
import type { Metadata } from 'next'
import type { Message } from 'ai'

export const dynamic = 'force-dynamic'

const ChatPage: React.FC<DynamicPageProps> = async ({ params }: DynamicPageProps) => {
  const { locale, id } = await params
  setRequestLocale(locale)

  const token = protectRoute(await cookies(), locale) as string

  const response = await Fetch.get<{
    data: {
      messages: Message[]
    }
  }>(`${Env.appUrl}/api/chat/${id}`, {
    Authorization: `Bearer ${token}`
  })

  if (response.status >= 400) {
    redirect({
      href: '/',
      locale
    })
  }

  const json = await response.json()
  return <ChatClientPage token={token} chatId={id} initialMessages={json?.data?.messages || []} />
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
