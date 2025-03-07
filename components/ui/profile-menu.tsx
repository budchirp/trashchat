'use client'

import type React from 'react'
import { Fragment, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import { Container } from '@/components/container'
import { Button } from '@/components/button'
import { Box } from '@/components/box'
import { cn } from '@/lib/cn'
import { LogIn, LogOut, type LucideIcon, UserIcon, UserPlus } from 'lucide-react'
import { Menu, Transition, MenuButton, MenuItems, MenuItem } from '@headlessui/react'
import { Backdrop } from '@/components/backdrop'
import { CookieMonster } from '@/lib/cookie-monster'
import { CONSTANTS } from '@/lib/constants'
import { toast } from '@/lib/toast'
import { useTranslations } from 'next-intl'
import { Fetch } from '@/lib/fetch'
import { Link } from '@/lib/i18n/routing'

import type { User } from '@/types/user'
import { usePathname, useRouter } from 'next/navigation'

export type ProfileMenuProps = {
  sidebar?: boolean
}

export type ProfileMenuItemProps = {
  children: React.ReactNode
  icon: React.ReactNode
}

const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({ children, icon }): React.ReactNode => {
  return (
    <MenuItem>
      <div
        className={cn(
          'border-border flex h-min w-full cursor-pointer items-center border-b px-4 py-2 transition duration-300 last:border-none',
          'bg-background-primary hover:bg-background-secondary'
        )}
      >
        <div
          className={cn(
            'flex h-full w-full items-center gap-2 font-medium transition duration-300',
            'text-text-primary hover:text-text-secondary'
          )}
        >
          {icon}

          <span>{children}</span>
        </div>
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

  const [loading, setLoading] = useState<boolean>(true)
  const [user, setUser] = useState<User | null>(null)

  const t = useTranslations('auth')
  const t_common = useTranslations('common')

  const cookieMonster = new CookieMonster()

  const fetchUser = async () => {
    const token = cookieMonster.get(CONSTANTS.COOKIES.TOKEN_NAME)
    if (token) {
      setLoading(true)

      try {
        const response = await Fetch.get<{
          data: User
        }>('/api/user', {
          Authorization: `Bearer ${token}`
        })

        const json = await response.json()
        if (response.status < 400) {
          setUser(json.data)
        }
      } catch {}
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return (
    <Menu>
      {({ open, close }) => {
        const Icon: LucideIcon | null = mounted || !loading ? UserIcon : null

        useEffect((): void => {
          close()

          window.scrollTo({ top: 0, behavior: 'smooth' })
        }, [pathname])

        useEffect(() => {
          if (open) fetchUser()
        }, [open])

        return (
          <div>
            {mounted &&
              createPortal(<Backdrop open={open} />, document.querySelector('#main') as Element)}

            <MenuButton as={Fragment}>
              <Button
                loading={!mounted}
                aria-label='Open theme switcher menu'
                variant='round'
                color='secondary'
              >
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
                  className='top-0 min-w-24 max-w-48 overflow-hidden'
                >
                  {loading ? (
                    <div className='px-4 py-3'>
                      <p>{t_common('loading')}</p>
                    </div>
                  ) : user ? (
                    <>
                      <ProfileMenuItem icon={<UserIcon />}>
                        <Link href='/user'>
                          <h2 className='font-bold text-text-accent-primary'>{user.name}</h2>
                          <h3 className='text-text-tertiary'>{user.username}</h3>
                        </Link>
                      </ProfileMenuItem>

                      <ProfileMenuItem icon={<LogOut />}>
                        <button
                          type='button'
                          onClick={() => {
                            cookieMonster.delete(CONSTANTS.COOKIES.TOKEN_NAME)

                            setUser(null)
                            close()
                            toast(t_common('success'))

                            router.push('/')
                          }}
                        >
                          {t('logout')}
                        </button>
                      </ProfileMenuItem>
                    </>
                  ) : (
                    <>
                      <ProfileMenuItem icon={<LogIn />}>
                        <Link href='/auth/signin'>{t('signin.text')}</Link>
                      </ProfileMenuItem>

                      <ProfileMenuItem icon={<UserPlus />}>
                        <Link href='/auth/signup'>{t('signup.text')}</Link>
                      </ProfileMenuItem>
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
