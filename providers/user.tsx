'use client'

import type React from 'react'
import { UserContext } from './context/user'
import type { User } from '@/types/user'
import { useState } from 'react'

type UserProviderProps = {
  children: React.ReactNode
  initialUser: User
}

export const UserProvider: React.FC<UserProviderProps> = ({
  children,
  initialUser
}: UserProviderProps): React.ReactNode => {
  const [user, setUser] = useState<User>(initialUser)

  return (
    <UserContext.Provider
      value={{
        user,
        setUser
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
