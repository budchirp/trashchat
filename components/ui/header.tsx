'use client'

import type React from 'react'
import { use } from 'react'

import { SidebarContext } from '@/providers/context/sidebar'
import { UserContext } from '@/providers/context/user'
import { Container } from '@/components/container'
import { Button } from '@/components/button'
import { useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n/routing'
import { Logo } from '@/components/logo'
import { MenuIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

type HeaderLinkProps = {
  href: string
  children: React.ReactNode
}

const HeaderLink: React.FC<HeaderLinkProps> = ({
  href,
  children
}: HeaderLinkProps): React.ReactNode => {
  return (
    <Link
      className='text-lg text-text-tertiary font-medium hover:font-bold transition-all duration-300 hover:text-text-primary '
      href={href}
    >
      {children}
    </Link>
  )
}

type HeaderProps = {
  isSidebarLayout?: boolean
}

export const Header: React.FC<HeaderProps> = ({
  isSidebarLayout = false
}: HeaderProps): React.ReactNode => {
  const t = useTranslations()

  const { user } = use(UserContext)
  const { showSidebar, setShowSidebar } = use(SidebarContext)

  return (
    <>
      <header
        className={cn(
          'select-none bg-background-primary/50 border-b right-0 border-border transition-all duration-300 fixed top-0 z-20 flex h-16 items-center justify-center backdrop-blur-sm',
          showSidebar ? 'w-full md:w-3/4 ease-out' : 'w-full ease-in'
        )}
      >
        <Container className='flex items-center h-16 justify-between gap-2'>
          <Logo />

          <div className='flex h-full items-center gap-2'>
            {!user && (
              <>
                <HeaderLink href='/auth/signin'>{t('auth.signin.text')}</HeaderLink>

                <HeaderLink href='/auth/signup'>{t('auth.signup.text')}</HeaderLink>
              </>
            )}

            {user && !isSidebarLayout && (
              <HeaderLink href='/chat'>{t('landing.go-to-chat')}</HeaderLink>
            )}

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

      <div className='h-16' />
    </>
  )
}
Header.displayName = 'Header'
