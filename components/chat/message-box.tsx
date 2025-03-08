import type React from 'react'
import type { Ref } from 'react'

import { Box } from '@/components/box'
import { useTranslations } from 'next-intl'

import type { Message } from 'ai'
import { cn } from '@/lib/cn'

export type MessageBoxProps = {
  className?: string
  message: React.ReactNode
  role: Message['role']
  ref?: Ref<HTMLDivElement>
}

export const MessageBox: React.FC<MessageBoxProps> = ({
  className,
  message,
  role,
  ref
}: MessageBoxProps): React.ReactNode => {
  const t = useTranslations('chat')

  return (
    <Box
      variant='primary'
      padding='none'
      className={cn(
        'grid px-4 !pt-3 pb-4 w-full overflow-hidden gap-2 bg-background-primary/50 backdrop-blur-sm',
        className
      )}
      ref={ref}
    >
      <h2 className='font-bold select-none text-text-tertiary'>
        {role === 'user' ? t('you') : role === 'assistant' ? t('ai') : t('system')}
      </h2>

      <article className='prose select-text dark:prose-dark max-w-full! !p-0 overflow-hidden break-words text-text-primary'>
        {message}
      </article>
    </Box>
  )
}
MessageBox.displayName = 'MessageBox'
