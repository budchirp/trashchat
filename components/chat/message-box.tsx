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
        'w-full group gap-2 flex flex-col justify-center',
        message.role === 'user' ? 'items-end' : 'items-start'
      )}
    >
      <Box
        variant='primary'
        padding='none'
        className={cn(
          message.role === 'user'
            ? 'grid py-2 px-4 overflow-hidden gap-2 bg-background-primary/50 backdrop-blur-sm w-fit'
            : 'bg-transparent rounded-none border-none',
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

        <article className='prose select-text dark:prose-dark max-w-full! !p-0 overflow-hidden break-words text-text-primary'>
          {message.content || message.text}
        </article>
      </Box>

      <div className='pe-2 invisible opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:visible'>
        <CopyButton variant='small' content={message.text} />
      </div>
    </div>
  )
}
MessageBox.displayName = 'MessageBox'
