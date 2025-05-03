'use client'

import type React from 'react'

import { Container } from '@/components/container'
import { Logo } from '@/components/logo'
import { cn } from '@/lib/cn'
import { ThemeSwitcher } from '@/components/ui/theme-switcher'
import { ProfileMenu } from '@/components/ui/profile-menu'
import { Sidebar } from '@/components/ui/sidebar'
import { useEffect, useState } from 'react'
import { Button } from '@/components/button'
import { MenuIcon } from 'lucide-react'
import { createPortal } from 'react-dom'
import { Backdrop } from '@/components/backdrop'
import { Transition } from '@headlessui/react'
import { usePathname } from 'next/navigation'

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

  const pathname = usePathname()
  useEffect(() => {
    setShowSidebar(false)
  }, [pathname])

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

      {mounted &&
        sidebar &&
        createPortal(
          <Transition show={showSidebar}>
            <Sidebar onClose={() => setShowSidebar(false)} />
          </Transition>,
          document.body
        )}

      {mounted &&
        sidebar &&
        createPortal(
          <Backdrop open={showSidebar} onClose={() => setShowSidebar(false)} />,
          document.body
        )}

      <div className='h-16' />
    </>
  )
}
Header.displayName = 'Header'
