'use client'

import type React from 'react'
import { useEffect, useState } from 'react'

import { Container } from '@/components/container'
import { useTranslations } from 'next-intl'
import { Fetch } from '@/lib/fetch'
import { Box } from '@/components/box'
import { Link } from '@/lib/i18n/routing'
import { Plus, Trash } from 'lucide-react'
import { Button } from '@/components/button'
import { cn } from '@/lib/cn'
import { CookieMonster } from '@/lib/cookie-monster'
import { CONSTANTS } from '@/lib/constants'
import { toast } from '@/lib/toast'

import type { Chat } from '@/types/chat'
import { usePathname, useRouter } from 'next/navigation'

export const Sidebar: React.FC = (): React.ReactNode => {
  const pathname = usePathname()
  const router = useRouter()

  const [mounted, setMounted] = useState<boolean>(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const [loading, setLoading] = useState<boolean>(true)
  const [chats, setChats] = useState<Chat[]>([])

  const t_common = useTranslations('common')

  const cookieMonster = new CookieMonster()

  const fetchChats = async () => {
    const token = cookieMonster.get(CONSTANTS.COOKIES.TOKEN_NAME)
    if (token) {
      try {
        const response = await Fetch.get<{
          data: Chat[]
        }>('/api/chat', {
          Authorization: `Bearer ${token}`
        })

        const json = await response.json()
        if (response.status < 400) {
          setChats(json.data)
        }
      } catch {
      } finally {
        setLoading(false)
      }
    }
  }

  const deleteChat = async (id: string) => {
    const token = cookieMonster.get(CONSTANTS.COOKIES.TOKEN_NAME)
    if (token) {
      try {
        const response = await Fetch.delete<{
          data: Chat[]
        }>(`/api/chat?id=${id}`, {
          Authorization: `Bearer ${token}`
        })

        if (response.status < 400) {
          toast(t_common('success'))
        } else {
          toast(t_common('error'))

          fetchChats()
        }
      } catch {
      } finally {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    fetchChats()
  }, [])

  useEffect(() => {
    fetchChats()
  }, [pathname])

  return (
    <div className='w-1/4 bg-background-primary fixed top-0 left-0 flex flex-col h-screen border-r border-border'>
      <div className='w-full h-16 bg-background-primary flex items-center justify-center border-b border-border'>
        <Container className='h-16 w-full flex items-center justify-between'>
          <h1 className='font-bold text-2xl'>Chats</h1>
        </Container>
      </div>

      <Container className='grid gap-2 size-full overflow-y-scroll my-4'>
        {!loading && mounted && chats ? (
          <>
            <Box className='h-min' padding='small'>
              <Link
                className='text-text-primary items-center font-medium flex gap-2 hover:text-text-secondary'
                href='/chat'
                onClick={() => {
                  fetchChats()
                }}
              >
                <Button variant='round' color='secondary'>
                  <Plus size={16} />
                </Button>

                <span>New chat</span>
              </Link>
            </Box>

            <div className='flex flex-col-reverse gap-2'>
              {chats.map((chat) => {
                const selected = pathname.includes(chat.id)

                return (
                  <Box
                    padding='small'
                    className='group flex items-center justify-between gap-2'
                    key={chat.id}
                  >
                    <Link
                      className={cn(
                        'transition-all ms-2 duration-300 text-ellipsis',
                        selected
                          ? 'text-text-accent-primary font-bold'
                          : 'text-text-primary font-medium hover:font-bold hover:text-text-secondary'
                      )}
                      href={`/chat/${chat.id}`}
                    >
                      {chat.title}
                    </Link>

                    <Button
                      onClick={() => {
                        setChats(chats.filter((_chat) => _chat.id !== chat.id))

                        deleteChat(chat.id)

                        if (selected) {
                          router.push('/')
                        }
                      }}
                      variant='round'
                      className='invisible opacity-0 group-hover:opacity-100 group-hover:visible transition-all duration-300'
                      type='button'
                    >
                      <Trash size={16} />
                    </Button>
                  </Box>
                )
              })}
            </div>
          </>
        ) : (
          <h1>{t_common('loading')}</h1>
        )}
      </Container>
    </div>
  )
}
Sidebar.displayName = 'Sidebar'
