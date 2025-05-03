'use client'

import type React from 'react'
import { useEffect, useRef, useState, type FormEvent } from 'react'

import { MemoizedMarkdown } from '@/components/markdown/memoized'
import { ChatForm } from '@/components/chat/chat-form'
import { MessageBox } from '@/components/chat/message-box'
import { Container } from '@/components/container'
import { Fetch } from '@/lib/fetch'
import { generateId } from 'ai'
import { useChat } from '@ai-sdk/react'
import { useLocale, useTranslations } from 'next-intl'
import imageCompression from 'browser-image-compression'

import type { Chat } from '@/types/chat'
import type { AIModelID } from '@/lib/ai/models'
import type { File as PrismaFile } from '@prisma/client'

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

  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [files, setFiles] = useState<File[]>([])

  const [messageFiles, setMessageFiles] = useState<{
    [index: number]: File[]
  }>({})

  const ref = useRef<HTMLDivElement | null>(null)

  const locale = useLocale()

  const { messages, setMessages, input, status, stop, handleInputChange, handleSubmit } = useChat({
    api: `/api/chat/${chat.id}/message`,
    initialMessages: (chat.messages as any) || [],
    headers: {
      authorization: `Bearer ${token}`,
      'accept-language': locale
    },
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
        {messages.map((message: any, index) => (
          <MessageBox
            key={index}
            message={{
              ...message,
              files:
                message.files && message.files.length > 0
                  ? message.files
                  : messageFiles[index] || [],
              text: message.content,
              content: <MemoizedMarkdown content={message.content} />
            }}
          />
        ))}

        {messages.length > 0 && status === 'submitted' && (
          <MessageBox
            message={
              {
                text: t_common('loading'),
                role: 'assistant',
                files: []
              } as any
            }
          />
        )}

        {messages.length < 1 && (
          <div className='h-[calc(100vh-4rem-4rem-4rem-1rem)] flex flex-col gap-4 items-center text-center justify-center'>
            <h1 className='font-bold text-2xl'>{t('start')}</h1>
          </div>
        )}
      </Container>

      <div ref={ref} />

      <ChatForm
        loading={status === 'streaming' || status === 'submitted' || isUploading}
        isUploading={isUploading}
        stop={stop}
        model={model}
        input={input}
        files={files}
        handleFilesChange={setFiles}
        handleModelChange={setModel}
        handleInputChange={handleInputChange}
        handleSubmit={async (event?: FormEvent) => {
          setError(null)

          event && event.preventDefault()

          let uploadedFiles: Partial<PrismaFile>[] = []

          if (files.length > 0) {
            setIsUploading(true)

            try {
              const response = await Fetch.post<{
                data: {
                  [filename: string]: {
                    url: string
                    fields: any
                  }
                }
              }>(
                '/api/upload',
                {
                  files: files.map((file) => ({
                    name: file.name,
                    contentType: file.type
                  }))
                },
                {
                  authorization: `Bearer ${token}`
                }
              )

              if (response.ok) {
                const json = await response.json()

                await Promise.all(
                  files.map(async (file) => {
                    if (file.size > 1024 * 1024 * 3) {
                      setError(t('file-too-big'))
                      return
                    }

                    const { url, fields } = json.data[file.name]

                    const formData = new FormData()
                    for (const [key, value] of Object.entries(fields)) {
                      formData.append(key, value as string)
                    }

                    let compressed = file
                    try {
                      if (file.type.startsWith('image/'))
                        compressed = await imageCompression(file, {
                          maxSizeMB: 1,
                          useWebWorker: true
                        })
                    } catch {
                      compressed = file
                    }

                    formData.append(
                      'file',
                      new File(
                        [compressed.slice(0, compressed.size, compressed.type)],
                        fields.key,
                        {
                          type: compressed.type
                        }
                      )
                    )

                    uploadedFiles = [
                      ...uploadedFiles,
                      {
                        name: file.name,
                        contentType: file.type,
                        url: `${url}${fields.key}`
                      }
                    ]

                    try {
                      await Fetch.post(url, formData)
                    } catch {}
                  })
                )
              } else {
                setError(t('upload-fail'))
              }
            } catch {
              setError(t('upload-fail'))
            } finally {
              setIsUploading(false)
            }
          }

          if (!error) {
            handleSubmit(event, {
              body: {
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
