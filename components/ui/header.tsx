'use client'

import type React from 'react'
import { createPortal } from 'react-dom'
import { useState, useEffect } from 'react'

import { Container } from '@/components/container'
import { Button } from '@/components/button'
import { Logo } from '@/components/logo'
import { Box } from '@/components/box'
import { cn } from '@/lib/cn'
import { Transition, Menu, MenuItems, MenuButton } from '@headlessui/react'
import { Menu as MenuIcon, X } from 'lucide-react'
import { Backdrop } from '@/components/backdrop'
import { ThemeSwitcher } from '@/components/ui/theme-switcher'
import { ProfileMenu } from '@/components/ui/profile-menu'
import { usePathname } from 'next/navigation'

type HeaderProps = {
  sidebar?: boolean
}

export const Header: React.FC<HeaderProps> = ({
  sidebar = false
}: HeaderProps): React.ReactNode => {
  const pathname = usePathname()

  const [mounted, setMounted] = useState<boolean>(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Menu>
      {({ open, close }) => {
        useEffect((): void => {
          close()

          window.scrollTo({ top: 0, behavior: 'smooth' })
        }, [pathname])

        return (
          <div>
            <header
              className={cn(
                'select-none bg-background-primary/50 border-b border-border fixed top-0 z-20 flex h-16 items-center justify-center backdrop-blur-sm',
                sidebar ? 'right-0 w-3/4' : 'w-full'
              )}
            >
              <Container className='flex items-center h-16 justify-between gap-2'>
                <Logo />

                <div className='flex h-full items-center gap-2'>
                  <ProfileMenu sidebar={sidebar} />
                  <ThemeSwitcher sidebar={sidebar} />

                  <MenuButton
                    as={Button}
                    className='md:hidden'
                    aria-label='Open menu'
                    variant='round'
                    color='secondary'
                    onClick={close}
                  >
                    {open ? <X /> : <MenuIcon />}
                  </MenuButton>
                </div>
              </Container>
            </header>

            {mounted &&
              createPortal(
                <Backdrop open={open} onClose={close} />,
                document.querySelector('#main') as Element
              )}

            <Transition
              show={open}
              as='div'
              className={cn(
                'w-screen h-screen_ flex justify-center items-center origin-[90%_0%] z-20 mx-auto inset-0 fixed',
                'transition-all scale-100 opacity-100',
                'data-closed:scale-90 data-closed:opacity-0',
                'data-enter:ease-out data-enter:duration-400',
                'data-leave:ease-in data-leave:duration-200'
              )}
            >
              <Container className='fixed top-20 flex h-min items-center justify-center'>
                <MenuItems
                  as={Box}
                  static
                  variant='primary'
                  className='top-0 grid w-full gap-2 overflow-hidden sm:max-w-(--breakpoint-xs)'
                >
                  <h2 className='text-2xl font-bold'>Links</h2>
                </MenuItems>
              </Container>
            </Transition>

      <div className='h-16' />
          </div>
        )
      }}
    </Menu>
  )
}
Header.displayName = 'Header'
