import type React from 'react'

import { authenticatedRoute } from '@/lib/auth/client'
import { SidebarContextProvider } from '@/providers/sidebar'
import { setRequestLocale } from 'next-intl/server'
import { ChatClientLayout } from './layout.client'
import { ChatAPIManager } from '@/lib/api/chat'
import { cookies } from 'next/headers'

import type { DynamicLayoutProps } from '@/types/layout'

const ChatLayout: React.FC<DynamicLayoutProps> = async ({
  children,
  params
}: DynamicLayoutProps) => {
  const { locale } = await params
  setRequestLocale(locale)

  const token = authenticatedRoute(await cookies())
  const chats = await ChatAPIManager.getAll({ token, locale })

  return (
    <SidebarContextProvider token={token} initialChats={chats || []}>
      <ChatClientLayout>{children}</ChatClientLayout>
    </SidebarContextProvider>
  )
}

export default ChatLayout
