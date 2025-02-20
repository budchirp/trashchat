'use client'

import type React from 'react'

import { ChatForm } from '@/components/chat/chat-form'
import { MessageBox } from '@/components/chat/message-box'
import { Container } from '@/components/container'
import { MemoizedMarkdown } from '@/components/markdown'
import { useChat } from '@ai-sdk/react'
import { useTranslations } from 'next-intl'

export const ChatClientPage: React.FC = (): React.ReactNode => {
  const { messages, input, status, stop, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
    onFinish: () => { }
  })
  
  const t = useTranslations('chat');

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

        {messages.length < 1 && (
          <div className='size-full flex items-center justify-center'>
            <h1 className='font-bold text-2xl'>{t("start")}</h1>
          </div>
        )}
      </Container>

      <ChatForm
        loading={status === 'streaming'}
        stop={stop}
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
      />
    </div>
  )
}
