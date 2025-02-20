import type React from 'react'

import { Box } from '@/components/box'

export type MessageBoxProps = {
  message: React.ReactNode
  role: 'user' | 'system' | string
}

export const MessageBox: React.FC<MessageBoxProps> = ({
  message,
  role
}: MessageBoxProps): React.ReactNode => (
  <Box
    variant='primary'
    className='grid w-full overflow-hidden gap-2 bg-background-primary/50 backdrop-blur-sm'
  >
    <h2 className='font-bold text-text-tertiary'>{role === 'user' ? 'You' : 'AI'}</h2>

    <article className='prose dark:prose-dark max-w-full! !p-0 -mb-2 overflow-x-scroll text-text-primary'>
      {message}
    </article>
  </Box>
)
MessageBox.displayName = 'MessageBox'
