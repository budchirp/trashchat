'use client'

import type React from 'react'
import { useState } from 'react'

import { UserContext } from '@/providers/context/user'
import { useLogout } from '@/lib/helpers/use-logout'
import { UserAPIManager } from '@/lib/api/user'

import type { User } from '@/types/user'

type UserProviderProps = {
  children: React.ReactNode
  initialUser: User
  token: string
}

export const UserProvider: React.FC<UserProviderProps> = ({
  children,
  initialUser,
  token
}: UserProviderProps): React.ReactNode => {
  const [user, setUser] = useState<User>(initialUser)

  const refetchUser = async () => {
    const user = await UserAPIManager.get(token!)
    if (user) {
      setUser(user)
    }
  }

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        refetchUser
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
