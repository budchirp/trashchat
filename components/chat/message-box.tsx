import type React from 'react'
import type { Ref } from 'react'

import { CopyButton } from '@/components/markdown/code/copy-button'
import { Box } from '@/components/box'
import { cn } from '@/lib/cn'
import { FileIcon } from 'lucide-react'

import type { UIMessage } from 'ai'
import type { File } from '@prisma/client'

type MessageBoxProps = {
  className?: string
  message: Partial<UIMessage> & {
    text: string
    content?: any
    files?: File[]
  }
  ref?: Ref<HTMLDivElement>
}

export const MessageBox: React.FC<MessageBoxProps> = ({
  className,
  message,
  ref
}: MessageBoxProps): React.ReactNode => {
  return (
    <div
      className={cn(
        'w-full group flex flex-col justify-center',
        message.role === 'user' ? 'items-end' : 'items-start'
      )}
    >
      <div
        className={cn(
          'flex flex-col justify-center gap-2 w-full',
          message.role === 'user' ? 'max-w-3/4 items-end' : ''
        )}
      >
        {message.files && message.files.length > 0 && (
          <div className='w-full flex flex-row-reverse items-center rounded-xl overflow-x-scroll'>
            <div className='flex gap-2 items-center'>
              {message.files.map((file, index) => {
                return (
                  <Box
                    className='size-16 flex shrink-0 items-center aspect-square overflow-hidden justify-center rounded-xl p-1'
                    key={index}
                    padding='none'
                  >
                    {file.contentType.startsWith('image/') ? (
                      <img
                        className='size-full rounded-lg object-cover'
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
          </div>
        )}

        <Box
          variant='primary'
          padding='none'
          className={cn(
            message.role === 'user'
              ? 'grid py-2 px-4 overflow-hidden gap-2 bg-background-primary/50 backdrop-blur-sm max-w-full w-fit'
              : 'bg-transparent rounded-none border-none',
            className
          )}
          ref={ref}
        >
          <article className='prose select-text dark:prose-dark max-w-full! !p-0 overflow-hidden break-words text-text-primary'>
            {message.content || message.text}
          </article>
        </Box>

        <div className='pe-2 invisible opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:visible'>
          <CopyButton variant='small' content={message.text} />
        </div>
      </div>
    </div>
  )
}
MessageBox.displayName = 'MessageBox'
