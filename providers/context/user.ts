import { createContext } from 'react'

import type { User } from '@/types/user'

type UserContextProps = {
  user: User
  setUser: any
  refetchUser: () => void
}

export const UserContext = createContext<UserContextProps>({
  user: null as any,
  setUser: () => {},
  refetchUser: () => {}
})
