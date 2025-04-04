'use client'

import { useTheme } from 'next-themes'
import type React from 'react'
import { Toaster } from 'sonner'

type ToastProviderProps = {
  children: React.ReactNode
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children
}: ToastProviderProps): React.ReactNode => {
  const { theme } = useTheme()

  return (
    <>
      <Toaster theme={theme as any} closeButton />

      {children}
    </>
  )
}
