'use client'

import type React from 'react'
import { useEffect, useRef, useState, type FormEvent } from 'react'

import { ChatForm } from '@/components/chat/chat-form'
import { MessageBox } from '@/components/chat/message-box'
import { Container } from '@/components/container'
import { useChat } from '@ai-sdk/react'
import { useLocale, useTranslations } from 'next-intl'
import { generateId } from 'ai'
import { MemoizedMarkdown } from '@/components/markdown/memoized'

import type { Chat } from '@/types/chat'
import type { AIModelID } from '@/lib/ai/models'

type ChatClientPageProps = {
  token: string
  chat: Chat
}

export const ChatClientPage: React.FC<ChatClientPageProps> = ({
  token,
  chat
}: ChatClientPageProps): React.ReactNode => {
  const t = useTranslations('chat')
  const t_common = useTranslations('common')

  const [model, setModel] = useState<AIModelID>(chat.model || 'gemini-2.0-flash')
  const [error, setError] = useState<string | null>(null)

  const ref = useRef<HTMLDivElement | null>(null)

  const locale = useLocale()

  const { messages, setMessages, input, status, stop, handleInputChange, handleSubmit } = useChat({
    api: `/api/chat/${chat.id}/message`,
    experimental_prepareRequestBody: ({ messages }) => {
      return { message: messages[messages.length - 1], model }
    },
    initialMessages: (chat.messages as any) || [],
    headers: {
      authorization: `Bearer ${token}`,
      'accept-language': locale
    },
    onFinish: () => {},
    onError: async (error) => {
      let erorrMessage: string | null = null
      try {
        const json = JSON.parse(error.message)
        erorrMessage = json.message
      } catch {
        erorrMessage = error.message
      }

      setError(erorrMessage || t_common('error'))
    }
  })

  useEffect(() => {
    if (error)
      setMessages([
        ...messages,
        {
          id: generateId(),
          role: 'system',
          content: error
        }
      ])
  }, [error])

  useEffect(() => {
    if (status === 'ready' && ref.current) {
      ref.current.scrollIntoView({
        behavior: 'smooth'
      })
    }
  }, [status])

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({
        behavior: 'smooth'
      })
    }
  }, [])

  return (
    <div className='flex size-full flex-col mt-4'>
      <Container className='flex flex-col gap-2 h-full'>
        {messages.map((message, index) => (
          <MessageBox
            key={index}
            message={<MemoizedMarkdown content={message.content} />}
            role={message.role}
          />
        ))}

        {messages.length > 0 && status === 'submitted' && (
          <MessageBox message={t_common('loading')} role='assistant' />
        )}

        {messages.length < 1 && (
          <div className='h-[calc(100vh-4rem-4rem-3rem)] flex flex-col gap-4 items-center text-center justify-center'>
            <h1 className='font-bold text-2xl'>{t('start')}</h1>
          </div>
        )}
      </Container>

      <div ref={ref} />

      <ChatForm
        loading={status === 'streaming' || status === 'submitted'}
        stop={stop}
        model={model}
        input={input}
        handleModelChange={(model) => setModel(model)}
        handleInputChange={handleInputChange}
        handleSubmit={(event: FormEvent) => {
          handleSubmit(event, {
            body: {
              model
            }
          })
        }}
      />
    </div>
  )
}
