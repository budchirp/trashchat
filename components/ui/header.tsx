'use client'

import type React from 'react'

import { Container } from '@/components/container'
import { Logo } from '@/components/logo'
import { cn } from '@/lib/cn'
import { ThemeSwitcher } from '@/components/ui/theme-switcher'
import { ProfileMenu } from '@/components/ui/profile-menu'
import { Sidebar } from './sidebar'
import { useEffect, useState } from 'react'
import { Button } from '../button'
import { MenuIcon, X } from 'lucide-react'
import { createPortal } from 'react-dom'
import { Backdrop } from '../backdrop'
import { Transition } from '@headlessui/react'

type HeaderProps = {
  sidebar?: boolean
}

export const Header: React.FC<HeaderProps> = ({
  sidebar = false
}: HeaderProps): React.ReactNode => {
  const [showSidebar, setShowSidebar] = useState<boolean>(false)

  const [mounted, setMounted] = useState<boolean>(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      <header
        className={cn(
          'select-none bg-background-primary/50 border-b border-border fixed top-0 z-20 flex h-16 items-center justify-center backdrop-blur-sm',
          sidebar ? 'right-0 w-full md:w-3/4' : 'w-full'
        )}
      >
        <Container className='flex items-center h-16 justify-between gap-2'>
          <Logo />

          <div className='flex h-full items-center gap-2'>
            <ProfileMenu sidebar={sidebar} />
            <ThemeSwitcher sidebar={sidebar} />

            {sidebar && (
              <Button
                className='md:hidden'
                aria-label='Open menu'
                variant='round'
                color='secondary'
                onClick={() => setShowSidebar(true)}
              >
                <MenuIcon />
              </Button>
            )}
          </div>
        </Container>
      </header>

      <Transition
        show={showSidebar}
        as='div'
        onClick={() => setShowSidebar(false)}
        className={cn(
          'z-50 inset-0 fixed',
          'transition-all opacity-100',
          'data-closed:-translate-x-full data-closed:opacity-75',
          'data-enter:ease-out data-enter:duration-400',
          'data-leave:ease-in data-leave:duration-200'
        )}
      >
        <div className='fixed left-0 top-0'>
          <Sidebar onClose={() => setShowSidebar(false)} />
        </div>
      </Transition>

      {mounted &&
        createPortal(
          <Backdrop
            className='!h-screen inset-0 z-40'
            open={showSidebar}
            onClose={() => setShowSidebar(false)}
          />,
          document.querySelector('#main') as Element
        )}

      <div className='h-16' />
    </>
  )
}
Header.displayName = 'Header'
