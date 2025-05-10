'use client'

import type React from 'react'
import { useState } from 'react'

import { SidebarContext } from '@/providers/context/sidebar'
import { ChatAPIManager } from '@/lib/api/chat'

import type { Chat } from '@/types/chat'

type SidebarContextProviderProps = {
  children: React.ReactNode
  initialChats: Chat[]
  token: string
}

export const SidebarContextProvider: React.FC<SidebarContextProviderProps> = ({
  children,
  initialChats,
  token
}: SidebarContextProviderProps): React.ReactNode => {
  const [showSidebar, setShowSidebar] = useState<boolean>(false)
  const [chats, setChats] = useState<Chat[]>(initialChats)

  const refreshChats = async () => {
    const chats = await ChatAPIManager.getAll(token)
    if (chats) setChats(chats)
  }

  return (
    <SidebarContext.Provider
      value={{
        showSidebar,
        setShowSidebar,
        chats,
        setChats,
        refreshChats
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}
