'use client'

import type React from 'react'
import { use, useEffect, useRef, useState, type ChangeEvent } from 'react'

import { Brain, FileIcon, Loader2, Paperclip, Search, Send, Square, Trash } from 'lucide-react'
import {
  AIModels,
  type AIModelID,
  type AIModelMap,
  type AIModelReasoningOption
} from '@/lib/ai/models'
import { ReasoningEffortSelector } from '@/components/chat/reasoning-effort-selector'
import { ModelSelector } from '@/components/chat/model-selector'
import { Button, buttonVariants } from '@/components/button'
import { SidebarContext } from '@/providers/context/sidebar'
import { UserContext } from '@/providers/context/user'
import { Container } from '@/components/container'
import { useTranslations } from 'next-intl'
import { toast } from '@/components/toast'
import { Input } from '@/components/input'
import { Box } from '@/components/box'
import { cn } from '@/lib/cn'

export type ChatFormProps = {
  isSkeleton?: boolean

  loading: boolean
  isUploading: boolean

  stop: () => void
  handleSubmit: any

  input: string

  files: File[]

  modelId: AIModelID
  models: AIModelMap

  reasoningEffort: AIModelReasoningOption | null

  useReasoning: boolean
  useSearch: boolean

  handleReasoningEffortChange: (reasoningEffort: AIModelReasoningOption | null) => void

  handleUseReasoningChange: (useReasoning: boolean) => void
  handleUseSearchChange: (useSearch: boolean) => void

  handleFilesChange: (files: File[]) => void

  handleModelIdChange: (modelId: AIModelID) => void
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export const ChatForm: React.FC<ChatFormProps> = ({
  isSkeleton = false,

  loading,
  isUploading,

  stop,
  handleSubmit,

  input,
  files,

  modelId,
  models,

  reasoningEffort,

  useReasoning,
  useSearch,

  handleReasoningEffortChange,
  handleUseReasoningChange,
  handleUseSearchChange,
  handleFilesChange,
  handleModelIdChange,
  handleInputChange
}: ChatFormProps): React.ReactNode => {
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

  const { user } = use(UserContext)
  const { showSidebar } = use(SidebarContext)

  const isPlus = user?.isPlus

  const model = models[modelId]
  const supportsAttachments = isPlus && (model?.imageUpload || model?.fileUpload)

  const t = useTranslations('chat')

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
          className={cn(
            'flex min-h-24 right-0 py-2 border-t border-border bottom-0 transition-all duration-300 items-center bg-background-primary/50 backdrop-blur-sm fixed select-none justify-center z-20',
            showSidebar ? 'w-full md:w-3/4 ease-out' : 'w-full ease-in'
          )}
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
                    className: !supportsAttachments ? '!opacity-50 pointer-events-none' : ''
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
                      toast(t('errors.only-image'))
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
                {loading && !isSkeleton ? <Square size={16} /> : <Send size={16} />}
              </Button>
            </div>

            <div className='flex items-center gap-2'>
              {model?.reasoning && (
                <Button
                  disabled={!isPlus}
                  aria-label='Toggle reasoning'
                  variant='round'
                  color={useReasoning || model?.company === 'deepseek' ? 'primary' : 'secondary'}
                  onClick={() => {
                    handleUseReasoningChange(!useReasoning)

                    if (!useReasoning) {
                      if (!reasoningEffort) {
                        handleReasoningEffortChange('low')
                      }
                    } else {
                      handleReasoningEffortChange(null)
                    }
                  }}
                >
                  <Brain size={16} />
                </Button>
              )}

              {model?.reasoning && useReasoning && isPlus && (
                <ReasoningEffortSelector
                  height={height}
                  reasoningEffort={reasoningEffort}
                  onReasoningEffortChange={handleReasoningEffortChange}
                />
              )}

              {model?.search && (
                <Button
                  disabled={!isPlus}
                  variant='round'
                  color={useSearch ? 'primary' : 'secondary'}
                  onClick={() => handleUseSearchChange(!useSearch)}
                >
                  <Search size={16} />
                </Button>
              )}

              <ModelSelector
                height={height}
                models={models}
                model={modelId}
                onModelChange={handleModelIdChange}
              />
            </div>
          </Container>
        </div>
      </form>
    </>
  )
}
ChatForm.displayName = 'ChatForm'
