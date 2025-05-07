'use client'

import type React from 'react'
import { useEffect, useRef, useState, type ChangeEvent } from 'react'

import { ModelSelector } from '@/components/chat/model-selector'
import { FileIcon, Loader2, Paperclip, Search, Send, Square, Trash } from 'lucide-react'
import { Container } from '@/components/container'
import { Input } from '@/components/input'
import { Box } from '@/components/box'
import { cn } from '@/lib/cn'
import { Button, buttonVariants } from '@/components/button'
import { useTranslations } from 'next-intl'
import { AIModels, type AIModelID } from '@/lib/ai/models'
import { toast } from '../toast'

export type ChatFormProps = {
  placeholder?: boolean
  loading: boolean
  isUploading: boolean
  stop: () => void
  handleSubmit: any
  input: string
  files: File[]
  modelId: AIModelID
  handleFilesChange: (files: File[]) => void
  handleModelChange: (model: AIModelID) => void
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void
}

const models = AIModels.get(false)

export const ChatForm: React.FC<ChatFormProps> = ({
  placeholder = false,
  loading,
  isUploading,
  stop,
  handleSubmit,
  input,
  files,
  modelId,
  handleFilesChange,
  handleModelChange,
  handleInputChange
}: ChatFormProps): React.ReactNode => {
  const t = useTranslations('chat')

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

  const model = models[modelId]
  const supportsAttachments = model.imageUpload || model.fileUpload

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
            <div className='w-full rounded-xl overflow-x-auto'>
              <div className='flex gap-2'>
                {supportsAttachments &&
                  (files || []).map((file, index) => {
                    return (
                      <Box
                        className='size-16 relative flex group shrink-0 items-center aspect-square overflow-hidden justify-center rounded-xl p-1'
                        key={index}
                        padding='none'
                      >
                        <div
                          className='invisible opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:visible absolute size-16 aspect-square rounded-xl bg-black/75 flex inset-0 items-center justify-center'
                          onClick={() => {
                            handleFilesChange(files.filter((_, _index) => index !== _index))
                          }}
                        >
                          <Trash size={16} />
                        </div>

                        {isUploading && (
                          <div className='absolute size-16 aspect-square rounded-xl bg-black/75 flex inset-0 items-center justify-center'>
                            <Loader2 className='animate-spin' />
                          </div>
                        )}

                        {file.type.startsWith('image/') ? (
                          <img
                            className='size-full rounded-lg object-cover'
                            aria-label={file.name}
                            src={URL.createObjectURL(file)}
                          />
                        ) : (
                          <FileIcon size={16} />
                        )}
                      </Box>
                    )
                  })}
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <Input
                textarea
                value={input}
                placeholder={t('say-something')}
                onChange={handleInputChange}
                icon={<Search size={16} />}
              />

              <label
                className={cn(
                  buttonVariants({
                    variant: 'round',
                    color: 'secondary',
                    className: !supportsAttachments ? '!opacity-75 pointer-events-none' : ''
                  })
                )}
                htmlFor='upload'
              >
                <Paperclip size={16} />

                <input
                  readOnly={!supportsAttachments}
                  disabled={!supportsAttachments}
                  id='upload'
                  className='sr-only'
                  type='file'
                  multiple
                  onChange={(e) => {
                    let filesArray = Array.from(e.target.files as FileList)

                    let error = false
                    filesArray.map((file, index) => {
                      if (!model.fileUpload && !file.type.startsWith('image/')) {
                        error = true

                        filesArray = filesArray.filter((_, _index) => index !== _index)
                      }
                    })

                    if (error) {
                      toast(t('only-image'))
                    }

                    handleFilesChange(filesArray)
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
              <ModelSelector
                height={height}
                models={models}
                model={modelId}
                onChange={handleModelChange}
              />
            </div>
          </Container>
        </div>
      </form>
    </>
  )
}
ChatForm.displayName = 'ChatForm'
