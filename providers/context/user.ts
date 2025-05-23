import { createContext } from 'react'

import type { User } from '@/types/user'

type UserContextProps = {
  user: User | null
  setUser: (user: User | null) => void

  refreshUser: () => void
}

export const UserContext = createContext<UserContextProps>({
  user: null,
  setUser: () => {},

  refreshUser: () => {}
})
