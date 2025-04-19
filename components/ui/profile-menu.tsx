'use client'

import type React from 'react'
import { Fragment, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import { LoaderCircle, LogIn, LogOut, type LucideIcon, UserIcon, UserPlus } from 'lucide-react'
import { Menu, Transition, MenuButton, MenuItems, MenuItem } from '@headlessui/react'
import { Container } from '@/components/container'
import { Button } from '@/components/button'
import { Box } from '@/components/box'
import { Backdrop } from '@/components/backdrop'
import { CookieMonster } from '@/lib/cookie-monster'
import { CONSTANTS } from '@/lib/constants'
import { toast } from '@/lib/toast'
import { useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n/routing'
import { usePathname, useRouter } from 'next/navigation'
import { SessionAPIManager } from '@/lib/api/session'
import { UserAPIManager } from '@/lib/api/user'
import { cn } from '@/lib/cn'

import type { User } from '@/types/user'

export type ProfileMenuProps = {
  sidebar?: boolean
}

export type ProfileMenuItemProps = {
  children: React.ReactNode
  icon: React.ReactNode
}

const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({ children, icon }): React.ReactNode => {
  return (
    <MenuItem
      as='div'
      className={cn(
        'border-border flex cursor-pointer h-min w-full items-center border-b px-4 py-2 transition duration-300',
        'bg-background-primary hover:bg-background-secondary'
      )}
    >
      <div
        className={cn(
          'flex w-full items-center gap-4 font-medium transition duration-300',
          'text-text-primary hover:text-text-secondary'
        )}
      >
        <div className='aspect-square flex items-center justify-center size-6'>{icon}</div>

        <div className='size-full text-start'>{children}</div>
      </div>
    </MenuItem>
  )
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({
  sidebar = false
}: ProfileMenuProps): React.ReactNode => {
  const pathname = usePathname()
  const router = useRouter()

  const [mounted, setMounted] = useState<boolean>(false)
  useEffect((): void => {
    setMounted(true)
  }, [])

  const [loading, setLoading] = useState<boolean>(false)
  const [user, setUser] = useState<User | null>(null)

  const t = useTranslations('auth')
  const t_common = useTranslations('common')

  const cookieMonster = new CookieMonster()

  const fetchUser = async () => {
    const token = cookieMonster.get(CONSTANTS.COOKIES.TOKEN_NAME)
    if (token) {
      setLoading(true)

      const user = await UserAPIManager.get(token)
      if (user) setUser(user)

      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  useEffect(() => {
    fetchUser()
  }, [pathname])

  return (
    <Menu>
      {({ open, close }) => {
        const Icon: LucideIcon | null = mounted || !loading ? UserIcon : null

        useEffect((): void => {
          close()

          window.scrollTo({ top: 0, behavior: 'smooth' })
        }, [pathname])

        return (
          <div>
            {mounted &&
              createPortal(<Backdrop open={open} />, document.querySelector('#main') as Element)}

            <MenuButton as={Fragment}>
              <Button aria-label='Open theme switcher menu' variant='round' color='secondary'>
                {Icon ? <Icon /> : null}
              </Button>
            </MenuButton>

            <Transition
              show={open}
              as='div'
              className={cn(
                'h-screen_ flex justify-center items-center origin-[75%_0%] md:origin-[85%_0%] z-20 mx-auto fixed',
                'transition-all scale-100 opacity-100',
                'data-closed:scale-90 data-closed:opacity-0',
                'data-enter:ease-out data-enter:duration-400',
                'data-leave:ease-in data-leave:duration-200',
                sidebar ? 'w-full md:w-3/4 right-0 top-0' : 'w-screen inset-0'
              )}
            >
              <Container className='fixed top-20 flex h-min items-center justify-end'>
                <MenuItems
                  static
                  as={Box}
                  variant='primary'
                  padding='none'
                  className='top-0 min-w-48 w-min max-w-64 overflow-hidden'
                >
                  {loading ? (
                    [...Array(2)].map((_, index) => (
                      <ProfileMenuItem key={index} icon={<LoaderCircle className='animate-spin' />}>
                        <div className='bg-background-tertiary h-2 w-full animate-pulse rounded-sm' />
                      </ProfileMenuItem>
                    ))
                  ) : user ? (
                    <>
                      <Link href='/settings'>
                        <ProfileMenuItem icon={<UserIcon />}>
                          <h2 className='font-bold text-text-accent-primary'>{user.name}</h2>
                          <h3 className='text-text-tertiary'>{user.username}</h3>
                        </ProfileMenuItem>
                      </Link>

                      <button
                        className='w-full'
                        type='button'
                        onClick={async () => {
                          await SessionAPIManager.delete()

                          toast(t_common('success'))

                          setUser(null)
                          close()

                          router.push('/')
                        }}
                      >
                        <ProfileMenuItem icon={<LogOut />}>{t('logout')}</ProfileMenuItem>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href='/auth/signin'>
                        <ProfileMenuItem icon={<LogIn />}>{t('signin.text')}</ProfileMenuItem>
                      </Link>
                      <Link href='/auth/signup'>
                        <ProfileMenuItem icon={<UserPlus />}>{t('signup.text')}</ProfileMenuItem>
                      </Link>
                    </>
                  )}
                </MenuItems>
              </Container>
            </Transition>
          </div>
        )
      }}
    </Menu>
  )
}
ProfileMenu.displayName = 'ProfileMenu'
