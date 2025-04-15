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
import { ChatAPIManager } from '@/lib/chat'
import { CONSTANTS } from '@/lib/constants'
import { toast } from '@/lib/toast'
import { usePathname } from 'next/navigation'

import type { Chat } from '@/types/chat'

type SidebarProps = {
  onClose?: () => void
} & ComponentProps<'div'>

type ChatChipProps = {
  chat?: Chat
  onDelete?: any
}

const ChatChip: React.FC<ChatChipProps> = ({
  chat,
  onDelete = () => {}
}: ChatChipProps): React.ReactNode => {
  const pathname = usePathname()

  const ChatBox = ({ selected = false }: { selected?: boolean }) => (
    <Box
      padding='small'
      variant='primary'
      hover={chat !== null && chat !== undefined}
      className={cn(
        'group flex items-center justify-between gap-2',
        selected && 'bg-background-secondary',
        !chat && 'animate-pulse'
      )}
    >
      <span
        className={cn(
          'transition-all ms-2 duration-300 w-full group-hover:font-bold text-ellipsis',
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

      <Button
        onClick={onDelete}
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
  )

  if (chat) {
    const selected = pathname.includes(chat.id)
    return (
      <Link href={`/chat/${chat.id}`} key={chat.id}>
        <ChatBox selected={selected} />
      </Link>
    )
  }

  return <ChatBox />
}

export const Sidebar: React.FC<SidebarProps> = ({
  onClose = () => {},
  ...props
}: SidebarProps): React.ReactNode => {
  const router = useRouter()

  const [mounted, setMounted] = useState<boolean>(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const [loading, setLoading] = useState<boolean>(true)
  const [chats, setChats] = useState<Chat[]>([])

  const t_common = useTranslations('common')
  const t_chat = useTranslations('chat')

  const cookieMonster = new CookieMonster()

  const fetchChats = async () => {
    const token = cookieMonster.get(CONSTANTS.COOKIES.TOKEN_NAME)
    if (token) {
      const chats = await ChatAPIManager.getAll(token)
      if (chats) setChats(chats)

      setLoading(false)
    }
  }

  const deleteChat = async (id: string, selected: boolean) => {
    const token = cookieMonster.get(CONSTANTS.COOKIES.TOKEN_NAME)
    if (token) {
      const deleted = await ChatAPIManager.delete(token, id)
      if (!deleted) {
        toast(t_common('error'))
        fetchChats()
      }

      if (selected) {
        const chat = await ChatAPIManager.get(token, '-1')
        if (chat) {
          router.push(`/chat/${chat.id}`)
        } else {
          router.push('/')
        }
      }
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

  useEffect(() => {
    fetchChats()
  }, [])

  const pathname = usePathname()

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
        <Box hover className='h-min group' onClick={() => !loading && newChat()} padding='small'>
          <div className='text-text-primary items-center font-medium flex gap-2 hover:text-text-secondary'>
            <Button variant='round' color='secondary'>
              <Plus size={16} />
            </Button>

            <span className='transition-all ms-2 duration-300 w-full group-hover:font-bold text-ellipsis text-text-tertiary font-medium group-hover:text-text-primary'>
              {t_chat('new-chat')}
            </span>
          </div>
        </Box>

        <div className='flex flex-col-reverse gap-2'>
          {!loading && mounted && chats
            ? chats.map((chat) => {
                return (
                  <ChatChip
                    key={chat.id}
                    chat={chat}
                    onDelete={async () => {
                      setChats(chats.filter((_chat) => _chat.id !== chat.id))

                      deleteChat(chat.id, pathname.includes(chat.id))
                    }}
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
