'use client'

import type React from 'react'
import { useEffect, useRef, useState, type FormEvent } from 'react'

import { MemoizedMarkdown } from '@/components/markdown/memoized'
import { MessageBox } from '@/components/chat/message-box'
import { ChatForm } from '@/components/chat/chat-form'
import { useLocale, useTranslations } from 'next-intl'
import { useUpload } from '@/lib/helpers/use-upload'
import { Container } from '@/components/container'
import { generateId, type UIMessage } from 'ai'
import { CONSTANTS } from '@/lib/constants'
import { useChat } from '@ai-sdk/react'

import type { Chat } from '@/types/chat'
import type { AIModelID, AIModelReasoningOption } from '@/lib/ai/models'
import type { File as PrismaFile } from '@prisma/client'

type ChatClientPageProps = {
  token: string
  chat: Chat
}

export const ChatClientPage: React.FC<ChatClientPageProps> = ({
  token,
  chat
}: ChatClientPageProps): React.ReactNode => {
  const t = useTranslations()

  const [model, setModel] = useState<AIModelID>(chat.model || CONSTANTS.AI.DEFAULT_MODEL)
  const [error, setError] = useState<string | null>(null)

  const [reasoningEffort, setReasoningEffort] = useState<AIModelReasoningOption | null>(null)

  const [useReasoning, setUseReasoning] = useState<boolean>(false)
  const [useSearch, setUseSearch] = useState<boolean>(false)

  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [files, setFiles] = useState<File[]>([])

  const [messageFiles, setMessageFiles] = useState<{
    [index: number]: PrismaFile[]
  }>({})

  const ref = useRef<HTMLDivElement | null>(null)

  const locale = useLocale()

  const { messages, setMessages, input, status, stop, handleInputChange, handleSubmit } = useChat({
    api: `/api/chat/${chat.id}/message`,
    initialMessages: (chat.messages as any) || [],
    headers: {
      authorization: `Bearer ${token}`,
      'accept-language': locale || 'en'
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

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({
        behavior: 'smooth'
      })
    }
  }, [])

  useEffect(() => {
    if (ref.current && status === 'ready') {
      ref.current.scrollIntoView({
        behavior: 'smooth'
      })
    }
  }, [status])
  return (
    <div className='size-full mt-4'>
      <Container className='grid gap-2 mb-2'>
        {(messages as (UIMessage & { files: PrismaFile[] })[]).map((message, index) => {
          const text =
            message.content ||
            (message.parts.find((part: any) => part.type === 'text') as any)?.text ||
            ''

          return (
            <MessageBox
              key={index}
              message={
                {
                  ...message,
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
          <MessageBox
            message={
              {
                role: 'assistant',
                files: [],
                parts: [
                  {
                    type: 'text',
                    text: t('common.loading')
                  }
                ]
              } as any
            }
          />
        )}

        {messages.length < 1 && (
          <div className='h-[calc(100vh-4rem-4rem-4rem-1rem)] flex flex-col gap-4 items-center text-center justify-center'>
            <h1 className='font-bold text-2xl opacity-90 tracking-wide'>{t('chat.start')}</h1>
          </div>
        )}
      </Container>

      <div ref={ref} />

      <ChatForm
        loading={status === 'streaming' || status === 'submitted' || isUploading}
        isUploading={isUploading}
        stop={stop}
        modelId={model}
        input={input}
        files={files}
        reasoningEffort={reasoningEffort}
        useReasoning={useReasoning}
        useSearch={useSearch}
        handleReasoningEffortChange={setReasoningEffort}
        handleUseReasoningChange={setUseReasoning}
        handleUseSearchChange={setUseSearch}
        handleFilesChange={setFiles}
        handleModelIdChange={setModel}
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
