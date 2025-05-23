'use client'

import type React from 'react'
import { useState } from 'react'

import { UserContext } from '@/providers/context/user'
import { UserAPIManager } from '@/lib/api/user'
import { useLocale } from 'next-intl'

import type { User } from '@/types/user'

type UserContextProviderProps = {
  children: React.ReactNode
  initialUser: User | null
  token: string
}

export const UserContextProvider: React.FC<UserContextProviderProps> = ({
  children,
  initialUser,
  token
}: UserContextProviderProps): React.ReactNode => {
  const [user, setUser] = useState<User | null>(initialUser)

  const locale = useLocale()

  const refreshUser = async () => {
    const user = await UserAPIManager.get({ token, locale })
    if (user) setUser(user)
  }

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        refreshUser
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
