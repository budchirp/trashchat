'use client'

import type React from 'react'
import { use, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import { SidebarContext } from '@/providers/context/sidebar'
import { Sidebar } from '@/components/ui/sidebar'
import { Backdrop } from '@/components/backdrop'
import { Header } from '@/components/ui/header'
import { Transition } from '@headlessui/react'
import { cn } from '@/lib/cn'

import type { LayoutProps } from '@/types/layout'

export const ChatClientLayout: React.FC<LayoutProps> = ({
  children
}: LayoutProps): React.ReactNode => {
  const [mounted, setMounted] = useState<boolean>(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const { showSidebar, setShowSidebar } = use(SidebarContext)

  return (
    <>
      {mounted &&
        createPortal(
          <Transition show={showSidebar}>
            <Sidebar />
          </Transition>,
          document.body
        )}

      {mounted &&
        createPortal(
          <Backdrop
            className='md:hidden'
            open={showSidebar}
            onClose={() => setShowSidebar(false)}
          />,
          document.body
        )}

      <div className='flex size-full justify-end'>
        <div
          id='main'
          className={cn(
            'transition-all duration-300 h-full',
            showSidebar ? 'w-full md:w-3/4 ease-out' : 'w-full ease-in'
          )}
        >
          <Header isSidebarLayout />

          <main className='w-full page-min-h-screen relative'>{children}</main>
        </div>
      </div>
    </>
  )
}
