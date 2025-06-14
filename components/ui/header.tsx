'use client'

import type React from 'react'
import { use } from 'react'

import { SidebarContext } from '@/providers/context/sidebar'
import { UserContext } from '@/providers/context/user'
import { Container } from '@/components/container'
import { Button } from '@/components/button'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/lib/i18n/routing'
import { Logo } from '@/components/logo'
import { MenuIcon } from 'lucide-react'
import { cn } from '@/lib/cn'
import { HeaderLink } from '../header-link'
import type { Routes } from '@/types/routes'

type HeaderProps = {
  isSidebarLayout?: boolean
}

export const Header: React.FC<HeaderProps> = ({
  isSidebarLayout = false
}: HeaderProps): React.ReactNode => {
  const { user } = use(UserContext)
  const { showSidebar, setShowSidebar } = use(SidebarContext)

  const t = useTranslations()

  const routes: Routes = [
    ...(user
      ? !isSidebarLayout
        ? [
            {
              location: '/chat',
              title: t('common.go-to-chat')
            }
          ]
        : []
      : [
          {
            location: '/auth/signin',
            title: t('auth.signin.text')
          },
          {
            location: '/auth/signup',
            title: t('auth.signup.text')
          }
        ])
  ]

  const pathname = usePathname()

  return (
    <header
      className={cn(
        'select-none bg-background-primary/50 border-b right-0 w-full border-border transition-all duration-300 sticky top-0 z-20 flex h-16 items-center justify-center backdrop-blur-sm',
        showSidebar ? 'ease-out' : 'ease-in'
      )}
    >
      <Container className='flex items-center h-16 justify-between gap-2'>
        <Logo />

        <div className='flex h-full items-center gap-2'>
          {routes.map((route) => {
            return (
              <HeaderLink
                href={route.location}
                selected={pathname === route.location}
                key={route.location}
              >
                {route.title}
              </HeaderLink>
            )
          })}

          {isSidebarLayout && (
            <Button
              aria-label='Toggle sidebar'
              variant='round'
              color='secondary'
              onClick={() => setShowSidebar(!showSidebar)}
            >
              <MenuIcon />
            </Button>
          )}
        </div>
      </Container>
    </header>
  )
}
