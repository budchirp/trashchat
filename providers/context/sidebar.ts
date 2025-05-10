import { createContext } from 'react'

import type { Chat } from '@/types/chat'

type SidebarContextProps = {
  chats: Chat[]
  setChats: (chats: Chat[]) => void

  showSidebar: boolean
  setShowSidebar: (showSidebar: boolean) => void
}

export const SidebarContext = createContext<SidebarContextProps>({
  showSidebar: false,
  setShowSidebar: () => {},
  chats: [],
  setChats: () => {}
})
