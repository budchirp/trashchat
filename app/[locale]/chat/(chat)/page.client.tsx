'use client'

import type React from 'react'

import { ChatForm } from '@/components/chat/chat-form'
import { MessageBox } from '@/components/chat/message-box'
import { Container } from '@/components/container'
import { MemoizedMarkdown } from '@/components/markdown'
import { useChat } from '@ai-sdk/react'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { generateId } from 'ai'
import type { modelNames } from '@/components/chat/model-selector'
import { Button } from '@/components/button'
import { toast } from '@/lib/toast'

export const ChatClientPage: React.FC = (): React.ReactNode => {
  const t = useTranslations('chat')
  const t_common = useTranslations('common')

  const [model, setModel] = useState<keyof typeof modelNames>('gemini-2.0-flash')
  const [message, setMessage] = useState<string>('')

  const ref = useRef<HTMLDivElement | null>(null)

  const { messages, setMessages, input, status, stop, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
    body: {
      model
    },
    onFinish: () => {},
    onError: async (error) => {
      let message: string | null = null
      try {
        const json = JSON.parse(error.message)
        message = json.message
      } catch {
        message = error.message
      }

      setMessage(message || t_common('error'))
    }
  })

  useEffect(() => {
    if (message.length > 0)
      setMessages([
        ...messages,
        {
          id: generateId(),
          role: 'system',
          content: message
        }
      ])
  }, [message])

  useEffect(() => {
    if (status === 'ready') {
      if (ref.current) {
        ref.current.scrollIntoView()
      }
    }
  }, [status])

  return (
    <div className='flex size-full flex-col mt-4'>
      <Container className='flex flex-col gap-2 size-full'>
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
          <div className='size-full flex flex-col gap-4 items-center text-center justify-center'>
            <h1 className='font-bold text-2xl'>{t('start')}</h1>
          </div>
        )}
      </Container>

      <div ref={ref} />

      <ChatForm
        loading={status === 'streaming'}
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
