'use client'

import type React from 'react'
import { useState } from 'react'

import { SidebarContext } from '@/providers/context/sidebar'

import type { Chat } from '@/types/chat'

type SidebarProviderProps = {
  children: React.ReactNode
  initialChats: Chat[]
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({
  children,
  initialChats
}: SidebarProviderProps): React.ReactNode => {
  const [showSidebar, setShowSidebar] = useState<boolean>(false)
  const [chats, setChats] = useState<Chat[]>(initialChats)

  return (
    <SidebarContext.Provider
      value={{
        showSidebar,
        setShowSidebar,
        chats,
        setChats
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}
