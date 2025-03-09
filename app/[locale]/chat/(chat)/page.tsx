import type React from 'react'

import { getTranslations, setRequestLocale } from 'next-intl/server'
import { MetadataManager } from '@/lib/metadata-manager'
import { Fetch } from '@/lib/fetch'
import { protectRoute } from '@/lib/auth/client/protect-route'
import { cookies } from 'next/headers'
import { Env } from '@/lib/env'
import { routing, redirect } from '@/lib/i18n/routing'

import type { Metadata } from 'next'
import type { DynamicPageProps } from '@/types/page'

const ChatPage: React.FC<DynamicPageProps> = async ({ params }: DynamicPageProps) => {
  const { locale } = await params
  setRequestLocale(locale)

  const token = protectRoute(await cookies(), locale) as string

  const response = await Fetch.get<{
    data: {
      id: string
    }
  }>(`${Env.appUrl}/api/chat/-1`, {
    authorization: `Bearer ${token}`
  })

  const json = await response.json()
  if (response.status < 400) {
    redirect({
      href: `/chat/${json.data.id}`,
      locale
    })
  } else {
    redirect({
      href: '/',
      locale
    })
  }

  return <></>
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
