import { createContext } from 'react'

import type { User } from '@/types/user'

type UserContextProps = {
  user: User
  setUser: any

  refreshUser: () => void
}

export const UserContext = createContext<UserContextProps>({
  user: null as any,
  setUser: () => {},

  refreshUser: () => {}
})
