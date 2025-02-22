import type React from 'react'

import { Box } from '@/components/box'
import type { Message } from 'ai'
import type { Ref } from 'react'

export type MessageBoxProps = {
  message: React.ReactNode
  role: Message['role']
  ref?: Ref<HTMLDivElement>
}

export const MessageBox: React.FC<MessageBoxProps> = ({
  message,
  role,
  ref
}: MessageBoxProps): React.ReactNode => (
  <Box
    variant='primary'
    padding='none'
    className='grid px-4 !pt-3 pb-4 w-full overflow-hidden gap-2 bg-background-primary/50 backdrop-blur-sm'
    ref={ref}
  >
    <h2 className='font-bold select-none text-text-tertiary'>
      {role === 'user' ? 'You' : role === 'assistant' ? 'AI' : 'System'}
    </h2>

    <article className='prose select-text dark:prose-dark max-w-full! !p-0 overflow-hidden break-all text-text-primary'>
      {message}
    </article>
  </Box>
)
MessageBox.displayName = 'MessageBox'
