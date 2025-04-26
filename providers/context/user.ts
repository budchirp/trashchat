import type { User } from '@/types/user'
import { createContext } from 'react'

export const UserContext = createContext<{
  user: User
  setUser: any
}>({
  user: null as any,
  setUser: () => {}
})
