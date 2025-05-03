import type React from 'react'

import { authenticatedRoute } from '@/lib/auth/client'
import { setRequestLocale } from 'next-intl/server'
import { Header } from '@/components/ui/header'
import { ChatAPIManager } from '@/lib/api/chat'
import { Sidebar } from '@/components/ui/sidebar'
import { cookies } from 'next/headers'

import type { DynamicLayoutProps } from '@/types/layout'

const ChatLayout: React.FC<DynamicLayoutProps> = async ({
  children,
  params
}: DynamicLayoutProps) => {
  const { locale } = await params
  setRequestLocale(locale)

  const token = authenticatedRoute(await cookies(), locale)
  const chats = await ChatAPIManager.getAll(token)

  return (
    <div className='flex size-full'>
      <div className='w-0 md:w-1/4 h-full relative hidden md:block'>
        <Sidebar initialChats={chats || []} />
      </div>

      <div id="main" className='w-full md:w-3/4 h-full'>
        <Header sidebar />

        <main className='w-full page-min-h-screen relative'>
          {children}
        </main>
      </div>
    </div>
  )
}

export default ChatLayout
