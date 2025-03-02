'use client'

import type React from 'react'
import { useRef, type ChangeEvent } from 'react'

import { Container } from '@/components/container'
import { Input } from '@/components/input'
import { Button } from '@/components/button'
import { Search, Send, Square } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ModelSelector, type ModelName } from './model-selector'

export type ChatFormProps = {
  loading: boolean
  stop: () => void
  handleSubmit: any
  input: string
  model: ModelName
  handleModelChange: (model: ModelName) => void
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export const ChatForm: React.FC<ChatFormProps> = ({
  loading,
  stop,
  handleSubmit,
  input,
  model,
  handleModelChange,
  handleInputChange
}: ChatFormProps): React.ReactNode => {
  const t = useTranslations('chat')
  const t_common = useTranslations('common')

  const ref = useRef<HTMLDivElement>(null)
  return (
    <>
      <div className='h-20 block relative opacity-0 select-none'>.</div>

      <form onSubmit={handleSubmit}>
        <div
          ref={ref}
          className='flex min-h-16 items-center bg-background-primary/50 backdrop-blur-sm fixed select-none justify-center right-0 w-3/4 py-2 border-t border-border bottom-0'
        >
          <Container className='flex items-center w-full justify-center gap-2'>
            <ModelSelector
              chatFormRef={ref}
              input={input}
              model={model}
              onChange={handleModelChange}
            />

            <Input
              textarea
              disabled={loading}
              value={input}
              placeholder={loading ? t_common('loading') : t('say-something')}
              onChange={handleInputChange}
              icon={<Search />}
              size={16}
            />

            <Button
              type='submit'
              variant='round'
              onClick={async () => {
                if (loading) {
                  stop()
                } else {
                  await handleSubmit()
                }
              }}
            >
              {loading ? <Square /> : <Send size={16} />}
            </Button>
          </Container>
        </div>
      </form>
    </>
  )
}
ChatForm.displayName = 'ChatForm'
