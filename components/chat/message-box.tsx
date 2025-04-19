import type React from 'react'
import type { Ref } from 'react'

import { Box } from '@/components/box'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/cn'
import { FileIcon } from 'lucide-react'

import type { UIMessage } from 'ai'
import type { File } from '@prisma/client'

type MessageBoxProps = {
  className?: string
  message: Partial<UIMessage> & {
    content: any
    files?: File[]
  }
  ref?: Ref<HTMLDivElement>
}

export const MessageBox: React.FC<MessageBoxProps> = ({
  className,
  message,
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
      {message.files && message.files.length > 0 && (
        <div className='flex gap-2 overflow-x-scroll'>
          {message.files.map((file, index) => {
            return (
              <Box
                className='size-16 relative flex items-center aspect-square overflow-hidden justify-center rounded-xl p-1'
                key={index}
                padding='none'
              >
                {file.contentType.startsWith('image/') ? (
                  <img
                    className='aspect-square size-max rounded-lg object-cover'
                    aria-label={file.name}
                    src={file.url}
                  />
                ) : (
                  <FileIcon size={16} />
                )}
              </Box>
            )
          })}
        </div>
      )}

      <h2 className='font-bold select-none text-text-tertiary'>
        {message.role === 'user' ? t('you') : message.role === 'assistant' ? t('ai') : t('system')}
      </h2>

      <article className='prose select-text dark:prose-dark max-w-full! !p-0 overflow-hidden break-words text-text-primary'>
        {message.content}
      </article>
    </Box>
  )
}
MessageBox.displayName = 'MessageBox'
