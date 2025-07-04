'use client'

import type React from 'react'
import { use, useEffect, useRef, useState, type FormEvent } from 'react'

import { MemoizedMarkdown } from '@/components/markdown/memoized'
import { SidebarContext } from '@/providers/context/sidebar'
import { MessageBox } from '@/components/chat/message-box'
import { useLocale, useTranslations } from 'next-intl'
import { UserContext } from '@/providers/context/user'
import { useUpload } from '@/lib/helpers/use-upload'
import { Container } from '@/components/container'
import { ChatForm } from '@/components/chat/form'
import { generateId, type UIMessage } from 'ai'
import { ChatAPIManager } from '@/lib/api/chat'
import { CONSTANTS } from '@/lib/constants'
import { useChat } from '@ai-sdk/react'
import { Env } from '@/lib/env'

import type { AIModelID, AIModelReasoningOption } from '@/lib/ai/models'
import type { Message, File as PrismaFile } from '@prisma/client'
import type { Chat } from '@/types/chat'

type ChatClientPageProps = {
  token: string
  chat: Chat
}

export const ChatClientPage: React.FC<ChatClientPageProps> = ({
  token,
  chat
}: ChatClientPageProps): React.ReactNode => {
  const t = useTranslations()

  const { user } = use(UserContext)

  const [model, setModel] = useState<AIModelID>(
    chat.model || (user?.customization?.defaultModel as AIModelID) || CONSTANTS.AI.DEFAULT_MODEL
  )

  const [error, setError] = useState<string | null>(null)

  const [useReasoning, setUseReasoning] = useState<boolean>(false)
  const [useSearch, setUseSearch] = useState<boolean>(false)

  const [reasoningEffort, setReasoningEffort] = useState<AIModelReasoningOption | null>(null)

  const [isUploading, setIsUploading] = useState<boolean>(false)

  const [files, setFiles] = useState<File[]>([])
  const [messageFiles, setMessageFiles] = useState<{
    [index: number]: PrismaFile[]
  }>({})

  const locale = useLocale()

  const { refreshChats } = use(SidebarContext)

  const { messages, setMessages, input, status, stop, handleInputChange, handleSubmit } = useChat({
    api: `/api/chat/${chat.id}/message`,
    id: chat.id,
    initialMessages: (chat.messages as any) || [],
    headers: {
      Authorization: `Bearer ${token}`,
      'accept-language': locale || 'en'
    },
    onFinish: async () => {
      if (messages.length < 2 && typeof window !== 'undefined') {
        refreshChats()

        const newChat = await ChatAPIManager.get({ token, locale }, chat.id)
        document.title = `${newChat?.title || t('chat.new-chat')} - ${Env.appName}`
      }
    },
    onError: async (error) => {
      let erorrMessage: string | null = null
      try {
        const json = JSON.parse(error.message)
        erorrMessage = json.message
      } catch {
        erorrMessage = error.message
      }

      setError(erorrMessage || t('errors.error'))
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

  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({
        behavior: 'smooth'
      })

      // wait for highlighter to load
      setTimeout(() => {
        ref.current?.scrollIntoView({
          behavior: 'smooth'
        })
      }, 500)
    }
  }, [])

  useEffect(() => {
    if (ref.current && status === 'ready') {
      ref.current.scrollIntoView({
        behavior: 'smooth'
      })
    }
  }, [messages])

  return (
    <div className='size-full mt-4'>
      <Container className='grid gap-2 mb-2'>
        {(messages as (Message & UIMessage & { files: PrismaFile[] })[]).map((message, index) => {
          const text =
            message.content ||
            (message.parts.find((part: any) => part.type === 'text') as any)?.text ||
            ''

          return (
            <MessageBox
              key={index}
              chatId={chat.id}
              messages={messages as any}
              handleMessagesChange={setMessages}
              message={
                {
                  ...message,
                  model: message.model || model,
                  files:
                    message.files && message.files.length > 0
                      ? message.files
                      : messageFiles[index] || [],
                  parts: [
                    ...message.parts.filter((part: any) => part.type !== 'text'),
                    {
                      type: 'text',
                      text: message.role === 'user' ? text : <MemoizedMarkdown content={text} />
                    }
                  ]
                } as any
              }
            />
          )
        })}

        {messages.length > 0 && status === 'submitted' && (
          <div>
            <h2 className='font-medium text-text-tertiary animate-pulse'>{t('common.loading')}</h2>
          </div>
        )}

        {messages.length < 1 && (
          <div className='h-[calc(100vh-4rem-4rem-4rem-1rem)] flex flex-col gap-4 items-center text-center justify-center'>
            <h1 className='font-bold text-2xl opacity-90'>{t('chat.start')}</h1>
          </div>
        )}
      </Container>

      <div ref={ref} />

      <ChatForm
        loading={status === 'streaming' || status === 'submitted' || isUploading}
        isUploading={isUploading}
        stop={stop}
        selectedModel={model}
        input={input}
        files={files}
        reasoningEffort={reasoningEffort}
        useReasoning={useReasoning}
        useSearch={useSearch}
        handleReasoningEffortChange={setReasoningEffort}
        handleUseReasoningChange={setUseReasoning}
        handleUseSearchChange={setUseSearch}
        handleFilesChange={setFiles}
        handleModelChange={setModel}
        handleInputChange={handleInputChange}
        handleSubmit={async (event?: FormEvent) => {
          setError(null)

          event && event.preventDefault()

          const uploadedFiles: Partial<PrismaFile>[] = []

          if (files.length > 0) {
            setIsUploading(true)

            await Promise.all(
              files.map(async (file) => {
                const error = await useUpload({ token, locale }, file, (file, url) => {
                  uploadedFiles.push({
                    name: file.name,
                    contentType: file.type,
                    url
                  })

                  if (error) {
                    switch (error) {
                      case 'size':
                        setError(t('errors.upload-size'))
                        break
                      case 'upload':
                        setError(t('errors.upload-fail'))
                        break
                    }
                  }
                })
              })
            )

            setIsUploading(false)
          }

          if (!error) {
            handleSubmit(event, {
              body: {
                reasoningEffort,
                useReasoning,
                useSearch,
                model,
                files: uploadedFiles
              }
            })

            setMessageFiles({
              ...messageFiles,
              [messages.length]: uploadedFiles as any
            })
          }

          setFiles([])
        }}
      />
    </div>
  )
}
