'use client'

import type React from 'react'
import { useEffect, useState, type ComponentProps } from 'react'

import { Container } from '@/components/container'
import { useTranslations } from 'next-intl'
import { Box } from '@/components/box'
import { Link, useRouter } from '@/lib/i18n/routing'
import { X, Plus, Trash } from 'lucide-react'
import { Button } from '@/components/button'
import { cn } from '@/lib/cn'
import { CookieMonster } from '@/lib/cookie-monster'
import { ChatAPIManager } from '@/lib/api/chat'
import { CONSTANTS } from '@/lib/constants'
import { toast } from '@/components/toast'
import { usePathname } from 'next/navigation'

import type { Chat } from '@/types/chat'
import { DeleteChatDialog } from '../chat/delete-chat-dialog'

type SidebarProps = {
  onClose?: () => void
  initialChats?: Chat[]
} & ComponentProps<'div'>

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
  const pathname = usePathname()

  const [showDeleteChatDialog, setShowDeleteChatDialog] = useState<boolean>(false)

  return (
    <>
      {chat && (
        <DeleteChatDialog
          id={chat.id}
          redirect={pathname.includes(chat.id)}
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

export const Sidebar: React.FC<SidebarProps> = ({
  onClose = () => {},
  initialChats = [],
  ...props
}: SidebarProps): React.ReactNode => {
  const router = useRouter()

  const [chats, setChats] = useState<Chat[]>(initialChats)

  const t_common = useTranslations('common')
  const t_chat = useTranslations('chat')

  const cookieMonster = new CookieMonster()

  const fetchChats = async () => {
    const token = cookieMonster.get(CONSTANTS.COOKIES.TOKEN_NAME)
    if (token) {
      const chats = await ChatAPIManager.getAll(token)
      if (chats) setChats(chats)
    }
  }

  const newChat = async () => {
    const token = cookieMonster.get(CONSTANTS.COOKIES.TOKEN_NAME)
    if (token) {
      const created = await ChatAPIManager.new(token)
      if (created) {
        router.push(`/chat/${created.id}`)
        fetchChats()
      } else {
        toast(t_common('error'))
        fetchChats()
      }
    }
  }

  const pathname = usePathname()
  useEffect(() => {
    fetchChats()
  }, [pathname])

  return (
    <div
      {...props}
      className={cn(
        'w-3/4 md:w-1/4 bg-background-primary fixed z-40 top-0 left-0 flex flex-col h-screen border-r border-border',
        'transition-all opacity-100',
        'data-closed:-translate-x-full data-closed:opacity-75',
        'data-enter:ease-out data-enter:duration-400',
        'data-leave:ease-in data-leave:duration-200'
      )}
    >
      <div className='w-full h-16 bg-background-primary flex items-center justify-center border-b border-border'>
        <Container className='h-16 w-full max-md:px-4 flex items-center justify-between'>
          <h1 className='font-bold text-2xl'>Chats</h1>

          <Button
            className='md:hidden'
            aria-label='Open menu'
            variant='round'
            color='secondary'
            onClick={onClose}
          >
            <X />
          </Button>
        </Container>
      </div>

      <Container className='grid gap-2 size-full max-lg:px-4 overflow-y-auto py-4'>
        <Box
          aria-label={t_chat('new-chat')}
          hover
          className='h-min group'
          onClick={() => newChat()}
          padding='small'
        >
          <div className='text-text-primary items-center gap-2 font-medium flex hover:text-text-secondary'>
            <Button aria-label='Plus icon' variant='round' color='secondary'>
              <Plus size={16} />
            </Button>

            <span className='transition-all duration-300 w-full group-hover:font-bold text-ellipsis text-text-tertiary font-medium group-hover:text-text-primary'>
              {t_chat('new-chat')}
            </span>
          </div>
        </Box>

        <div className='flex flex-col-reverse gap-2'>
          {chats
            ? chats.map((chat, index) => {
                return (
                  <ChatChip
                    onDelete={() => {
                      setChats(chats.filter((_chat) => _chat.id !== chat.id))

                      fetchChats()
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
    </div>
  )
}
Sidebar.displayName = 'Sidebar'
