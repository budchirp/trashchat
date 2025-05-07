import type React from 'react'
import type { Ref } from 'react'

import { CopyButton } from '@/components/markdown/code/copy-button'
import { Box } from '@/components/box'
import { cn } from '@/lib/cn'
import { FileIcon } from 'lucide-react'
import Image from 'next/image'

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
        'w-full group min-w-0 flex flex-col gap-2',
        message.role === 'user' ? 'items-end' : 'items-start'
      )}
    >
      {message.files && message.files.length > 0 && (
        <div className='rounded-xl w-full flex flex-row-reverse overflow-x-auto'>
          <div className='flex justify-end flex-row-reverse gap-2 items-center'>
            {message.files.map((file, index) => {
              return (
                <Box
                  className='size-16 flex shrink-0 items-center aspect-square overflow-hidden justify-center rounded-xl p-1'
                  key={index}
                  padding='none'
                >
                  {file.contentType.startsWith('image/') ? (
                    <Image
                      height={256}
                      width={256}
                      className='size-full rounded-lg object-cover'
                      alt={file.name}
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
            ? 'md:max-w-3/4 py-2 px-4 bg-background-primary/50 backdrop-blur-sm w-fit'
            : 'max-w-full bg-transparent rounded-none border-none',
          className
        )}
        ref={ref}
      >
        <article className='prose dark:prose-dark w-full !max-w-none break-words text-text-primary select-text'>
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
