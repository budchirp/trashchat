'use client'

import type React from 'react'
import { useEffect, useRef, useState, type ChangeEvent } from 'react'

import { ModelSelector } from '@/components/chat/model-selector'
import { FileIcon, Loader2, Paperclip, Search, Send, Square } from 'lucide-react'
import { Container } from '@/components/container'
import { Input } from '@/components/input'
import { Button, buttonVariants } from '@/components/button'
import { useTranslations } from 'next-intl'

import type { AIModelID } from '@/lib/ai/models'
import { Box } from '../box'
import { cn } from '@/lib/cn'

export type ChatFormProps = {
  placeholder?: boolean
  loading: boolean
  isUploading: boolean
  stop: () => void
  handleSubmit: any
  input: string
  files?: FileList
  model: AIModelID
  handleFilesChange: (files: FileList) => void
  handleModelChange: (model: AIModelID) => void
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export const ChatForm: React.FC<ChatFormProps> = ({
  placeholder = false,
  loading,
  isUploading,
  stop,
  handleSubmit,
  input,
  files,
  model,
  handleFilesChange,
  handleModelChange,
  handleInputChange
}: ChatFormProps): React.ReactNode => {
  const t = useTranslations('chat')
  const t_common = useTranslations('common')

  const ref = useRef<HTMLDivElement>(null)

  const [height, setHeight] = useState<number>(0)
  const updateHeight = () => {
    if (ref.current) {
      setHeight(ref.current.clientHeight)
    }
  }

  useEffect(() => {
    updateHeight()
  }, [])

  useEffect(() => {
    updateHeight()
  }, [input, files])

  return (
    <>
      <div
        style={{
          height: height > 0 ? `${height}px` : 'calc(var(--spacing) * 26)'
        }}
      />

      <form onSubmit={handleSubmit}>
        <div
          ref={ref}
          className='flex min-h-26 items-center bg-background-primary/50 backdrop-blur-sm fixed select-none justify-center z-20 right-0 w-full md:w-3/4 py-2 border-t border-border bottom-0'
        >
          <Container className='grid gap-2'>
            {files &&
              Array.from(files).map((file, index) => {
                return (
                  <Box
                    className='size-16 relative flex items-center aspect-square overflow-hidden justify-center rounded-xl p-1'
                    key={index}
                    padding='none'
                  >
                    {isUploading && (
                      <div className='absolute size-full rounded-xl bg-black/75 flex inset-0 items-center justify-center'>
                        <Loader2 className='animate-spin' />
                      </div>
                    )}

                    {file.type.startsWith('image/') ? (
                      <img
                        className='aspect-square size-max rounded-lg object-cover'
                        aria-label={file.name}
                        src={URL.createObjectURL(file)}
                      />
                    ) : (
                      <FileIcon size={16} />
                    )}
                  </Box>
                )
              })}

            <div className='flex items-center gap-2'>
              <Input
                textarea
                value={input}
                placeholder={loading ? t_common('loading') : t('say-something')}
                onChange={handleInputChange}
                icon={<Search size={16} />}
              />

              <label
                className={cn(buttonVariants({ variant: 'round', color: 'secondary' }))}
                htmlFor='upload'
              >
                <Paperclip size={16} />

                <input
                  id='upload'
                  className='sr-only'
                  type='file'
                  multiple
                  onChange={(e) => {
                    handleFilesChange(e.target.files as FileList)
                  }}
                />
              </label>

              <Button
                variant='round'
                type={loading ? 'button' : 'submit'}
                onClick={async () => {
                  if (loading) {
                    stop()
                  } else {
                    await handleSubmit()
                  }
                }}
              >
                {loading && !placeholder ? <Square size={16} /> : <Send size={16} />}
              </Button>
            </div>

            <div className='flex items-center'>
              <ModelSelector height={height} model={model} onChange={handleModelChange} />
            </div>
          </Container>
        </div>
      </form>
    </>
  )
}
ChatForm.displayName = 'ChatForm'
