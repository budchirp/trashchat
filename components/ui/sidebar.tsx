'use client'

import type React from 'react'
import { use, useEffect, useState } from 'react'

import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import { X, Plus, Trash, ChevronDown, User, LogOut } from 'lucide-react'
import { DeleteChatDialog } from '@/components/chat/delete-chat-dialog'
import { SidebarContext } from '@/providers/context/sidebar'
import { UserContext } from '@/providers/context/user'
import { useLogout } from '@/lib/helpers/use-logout'
import { CookieMonster } from '@/lib/cookie-monster'
import { Link, useRouter } from '@/lib/i18n/routing'
import { Container } from '@/components/container'
import { Backdrop } from '@/components/backdrop'
import { ChatAPIManager } from '@/lib/api/chat'
import { usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { Button } from '@/components/button'
import { CONSTANTS } from '@/lib/constants'
import { toast } from '@/components/toast'
import { Box } from '@/components/box'
import Image from 'next/image'
import { cn } from '@/lib/cn'

import type { Chat } from '@/types/chat'

type ProfileMenuItemProps = {
  children: React.ReactNode
}

const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({
  children
}: ProfileMenuItemProps): React.ReactNode => {
  return (
    <MenuItem as='div' className='w-full border-b border-border last:border-none'>
      {children}
    </MenuItem>
  )
}

type ProfileMenuItemContentProps = {
  children: React.ReactNode
  icon: React.ReactNode
}

const ProfileMenuItemContent: React.FC<ProfileMenuItemContentProps> = ({
  children,
  icon
}: ProfileMenuItemContentProps): React.ReactNode => {
  return (
    <MenuItem
      as='div'
      className={cn(
        'flex cursor-pointer h-min w-full items-center px-4 py-2 transition duration-300',
        'bg-background-primary hover:bg-background-secondary'
      )}
    >
      <div
        className={cn(
          'flex w-full items-center gap-4 font-medium transition duration-300',
          'text-text-primary hover:text-text-secondary'
        )}
      >
        <div className='aspect-square flex items-center justify-center shrink-0 size-8'>{icon}</div>

        <div className='size-full text-start'>{children}</div>
      </div>
    </MenuItem>
  )
}

const SidebarFooter: React.FC = (): React.ReactNode => {
  const { user } = use(UserContext)

  return (
    <div className='w-full h-16 cursor-pointer hover:bg-background-secondary bg-background-primary transition-all duration-300 sticky bottom-0 flex items-center justify-center border-t border-border'>
      <Container className='h-16 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <Image
            height={128}
            width={128}
            className='size-10 p-1 rounded-full border border-border aspect-square object-cover'
            alt={useTranslations('settings.account')('profile-picture')}
            src={user?.profilePicture || '/images/placeholder.png'}
          />

          <h2 className='text-text-primary font-medium text-lg'>{user?.name}</h2>
        </div>

        <ChevronDown size={16} />
      </Container>
    </div>
  )
}

const ProfileMenu = () => {
  const t = useTranslations()

  const logout = useLogout()

  return (
    <Menu>
      {({ open }) => {
        return (
          <div>
            <Backdrop
              fullscreen={false}
              open={open}
              className='backdrop-h-screen absolute top-0 z-10 w-full'
            />

            <MenuButton className='w-full'>
              <SidebarFooter />
            </MenuButton>

            <Transition
              show={open}
              as='div'
              className={cn(
                'flex justify-center items-center origin-[50%_100%] left-0 bottom-20 z-20 mx-auto w-full absolute',
                'transition-all scale-100 opacity-100',
                'data-closed:scale-90 data-closed:opacity-0',
                'data-enter:ease-out data-enter:duration-400',
                'data-leave:ease-in data-leave:duration-200'
              )}
            >
              <Container>
                <MenuItems static as={Box} variant='primary' padding='none' className='w-full'>
                  <ProfileMenuItem>
                    <Link href='/settings'>
                      <ProfileMenuItemContent icon={<User size={16} />}>
                        {t('settings.account.profile')}
                      </ProfileMenuItemContent>
                    </Link>
                  </ProfileMenuItem>

                  <ProfileMenuItem>
                    <button className='w-full' type='button' onClick={logout}>
                      <ProfileMenuItemContent icon={<LogOut size={16} />}>
                        {t('auth.logout')}
                      </ProfileMenuItemContent>
                    </button>
                  </ProfileMenuItem>
                </MenuItems>
              </Container>
            </Transition>
          </div>
        )
      }}
    </Menu>
  )
}

const SidebarHeader: React.FC = (): React.ReactNode => {
  const { setShowSidebar } = use(SidebarContext)

  return (
    <div className='w-full h-16 sticky top-0 bg-background-primary flex items-center justify-center border-b border-border'>
      <Container className='h-16 flex items-center justify-between'>
        <h1 className='font-bold text-2xl'>Chats</h1>

        <Button
          className='md:hidden'
          aria-label='Open menu'
          variant='round'
          color='secondary'
          onClick={() => setShowSidebar(false)}
        >
          <X />
        </Button>
      </Container>
    </div>
  )
}

type ChatChipProps = {
  selected?: boolean
  chat?: Chat
  onDelete?: any
}

const ChatChip: React.FC<ChatChipProps> = ({
  selected = false,
  chat,
  onDelete = () => {}
}: ChatChipProps): React.ReactNode => {
  const [showDeleteChatDialog, setShowDeleteChatDialog] = useState<boolean>(false)

  return (
    <>
      {chat && (
        <DeleteChatDialog
          id={chat.id}
          redirect={selected}
          onDelete={onDelete}
          open={showDeleteChatDialog}
          onClose={() => setShowDeleteChatDialog(false)}
        />
      )}

      <Box
        padding='small'
        variant='primary'
        aria-label={chat?.title}
        className={cn(
          'group flex items-center justify-between gap-2',
          selected && 'bg-background-secondary',
          !chat && 'animate-pulse'
        )}
      >
        <Link className='size-full flex items-center' href={`/chat/${chat ? chat.id : ''}`}>
          <span
            className={cn(
              'transition-all ms-2 duration-300 group-hover:font-bold text-ellipsis',
              selected
                ? 'text-text-accent-primary font-bold'
                : 'text-text-tertiary font-medium group-hover:text-text-primary'
            )}
          >
            {chat ? (
              chat.title
            ) : (
              <div className='bg-background-tertiary h-2 w-full animate-pulse rounded-sm' />
            )}
          </span>
        </Link>

        <Button
          onClick={() => chat && setShowDeleteChatDialog(true)}
          variant='round'
          className={cn(
            'invisible opacity-0 transition-all duration-300',
            chat && 'group-hover:opacity-100 group-hover:visible'
          )}
          type='button'
        >
          <Trash size={16} />
        </Button>
      </Box>
    </>
  )
}

const NewChatButton: React.FC = (): React.ReactNode => {
  const router = useRouter()

  const locale = useLocale()
  const t = useTranslations()

  const { refreshChats } = use(SidebarContext)

  const cookieMonster = new CookieMonster()

  const newChat = async () => {
    const token = cookieMonster.get(CONSTANTS.COOKIES.TOKEN_NAME)
    if (token) {
      const created = await ChatAPIManager.new({ token, locale })
      if (created) {
        router.push(`/chat/${created.id}`)
        refreshChats()
      } else {
        toast(t('errors.error'))
        refreshChats()
      }
    }
  }

  return (
    <Box
      aria-label={t('chat.new-chat')}
      hover
      variant='primary'
      className='h-min group'
      onClick={() => newChat()}
      padding='small'
    >
      <div className='text-text-primary items-center gap-2 font-medium flex hover:text-text-secondary'>
        <div className='size-10 p-2 flex items-center justify-center'>
          <Plus size={16} />
        </div>

        <span className='transition-all duration-300 w-full group-hover:font-bold text-ellipsis text-text-tertiary font-medium group-hover:text-text-primary'>
          {t('chat.new-chat')}
        </span>
      </div>
    </Box>
  )
}

const SidebarContent: React.FC = (): React.ReactNode => {
  const { chats, setChats, setShowSidebar, refreshChats } = use(SidebarContext)

  const pathname = usePathname()
  useEffect(() => {
    refreshChats()
  }, [pathname])

  return (
    <Container className='grid gap-2 h-full overflow-y-auto py-4'>
      <NewChatButton />

      <div className='flex flex-col-reverse w-full gap-2'>
        {chats
          ? chats.map((chat, index) => {
              return (
                <ChatChip
                  onDelete={() => {
                    setChats(chats.filter((_chat) => _chat.id !== chat.id))

                    refreshChats()

                    setShowSidebar(false)
                  }}
                  selected={
                    index === chats.length - 1 && pathname.endsWith('chat')
                      ? true
                      : pathname.includes(chat.id)
                  }
                  key={chat.id}
                  chat={chat}
                />
              )
            })
          : [...Array(2)].map((_, index) => {
              return <ChatChip key={index} />
            })}
      </div>
    </Container>
  )
}

export const Sidebar: React.FC = (props): React.ReactNode => {
  return (
    <div
      {...props}
      className={cn(
        'w-3/4 md:w-1/4 bg-background-primary select-none fixed z-30 top-0 left-0 flex flex-col h-screen border-r border-border',
        'transition-all opacity-100',
        'data-closed:-translate-x-full data-closed:opacity-75',
        'data-enter:ease-out data-enter:duration-300',
        'data-leave:ease-in data-leave:duration-300'
      )}
    >
      <SidebarHeader />

      <SidebarContent />

      <ProfileMenu />
    </div>
  )
}
