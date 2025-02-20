import type React from 'react'
import type { ChangeEvent } from 'react'

import { Container } from '@/components/container'
import { Input } from '@/components/input'
import { Button } from '@/components/button'
import { Search, Send, Square } from 'lucide-react'
import { useTranslations } from 'next-intl'

export type ChatFormProps = {
  loading: boolean
  stop: () => void
  handleSubmit: any
  input: string
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export const ChatForm: React.FC<ChatFormProps> = ({
  loading,
  stop,
  handleSubmit,
  input,
  handleInputChange
}: ChatFormProps): React.ReactNode => {
  const t = useTranslations('chat')

  return (
    <>
      <div className='h-20 block relative opacity-0 select-none'>.</div>

      <form onSubmit={handleSubmit}>
        <div className='flex min-h-16 items-center bg-background-primary/50 backdrop-blur-sm fixed justify-center w-full py-2 border-t border-border bottom-0'>
          <Container className='flex items-center w-full justify-center gap-2'>
            <Input
              textarea
              value={input}
              placeholder={t('say-something')}
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
