import type React from 'react'

import { CopyButton } from '@/components/markdown/code/copy-button'
import { AIModels, type AIModelID } from '@/lib/ai/models'
import { useLocale, useTranslations } from 'next-intl'
import { CookieMonster } from '@/lib/cookie-monster'
import { ChatAPIManager } from '@/lib/api/chat'
import { FileIcon, Trash } from 'lucide-react'
import { CONSTANTS } from '@/lib/constants'
import { Box } from '@/components/box'
import { cn } from '@/lib/cn'
import Image from 'next/image'

import type { File, Message } from '@prisma/client'
import type { UIMessage } from 'ai'

type FileItemProps = {
  children?: React.ReactNode
  className?: string

  file: {
    name: string
    url: string
    contentType: string
  }
}

export const FileItem: React.FC<FileItemProps> = ({
  children,
  className,
  file
}: FileItemProps): React.ReactNode => {
  return (
    <Box
      className={cn(
        'size-24 flex shrink-0 items-center aspect-square overflow-hidden justify-center rounded-2xl p-1',
        className
      )}
      variant='blurry'
      padding='none'
    >
      {children}

      {file.contentType.startsWith('image/') ? (
        <Image
          height={256}
          width={256}
          className='size-full rounded-xl object-cover'
          alt={file.name}
          src={file.url}
        />
      ) : (
        <FileIcon size={16} />
      )}
    </Box>
  )
}

type MessageBoxMessage = Partial<UIMessage> &
  Message & {
    content?: any
    files?: File[]
  }

type MessageBoxProps = {
  skeleton?: boolean

  className?: string

  chatId: string

  message: MessageBoxMessage

  messages: MessageBoxMessage[]
  handleMessagesChange: (message: MessageBoxMessage[]) => void

  ref?: React.Ref<HTMLDivElement>
}

export const MessageBox: React.FC<MessageBoxProps> = ({
  skeleton = false,

  className,
  chatId,

  message,

  messages,
  handleMessagesChange,

  ref
}: MessageBoxProps): React.ReactNode => {
  const locale = useLocale()
  const t = useTranslations()

  const cookieMonster = new CookieMonster()

  return (
    <div
      className={cn(
        'w-full group min-w-0 flex flex-col gap-2',
        message.role === 'user' ? 'items-end' : 'items-start'
      )}
    >
      {message.files && message.files.length > 0 && (
        <div
          className={cn(
            'rounded-xl w-full flex overflow-x-auto',
            message.role === 'user' && 'flex-row-reverse'
          )}
        >
          <div
            className={cn(
              'flex gap-2 items-center',
              message.role === 'user' && 'justify-end flex-row-reverse'
            )}
          >
            {message.files.map((file, index) => {
              return <FileItem key={index} file={file} />
            })}
          </div>
        </div>
      )}

      {message.parts && (
        <div
          className={cn(
            'w-full min-w-0 flex flex-col gap-2',
            message.role === 'user' ? 'items-end' : 'items-start'
          )}
        >
          <Box
            variant={message.role === 'user' ? 'blurry' : 'primary'}
            padding='none'
            className={cn(
              'grid gap-2 min-w-0',
              message.role === 'user'
                ? 'md:max-w-3/4 py-2 px-4 w-fit'
                : 'w-full bg-transparent rounded-none border-none',
              className
            )}
            ref={ref}
          >
            {message.parts
              .filter((part) => part.type !== 'source')
              .map((part, index) => {
                if (part.type === 'reasoning') {
                  return (
                    <details key={index}>
                      <summary className='text-text-primary font-medium'>
                        {t('chat.reasoning')}
                      </summary>

                      <p className='text-text-tertiary'>{part.reasoning}</p>
                    </details>
                  )
                }

                if (part.type === 'file' && part.mimeType.startsWith('image/')) {
                  return (
                    <FileItem
                      key={index}
                      file={
                        {
                          name: 'Generated',
                          contentType: part.mimeType,
                          url: `data:${part.mimeType};base64,${part.data}`
                        } as any
                      }
                    />
                  )
                }

                if (part.type === 'text') {
                  return (
                    <article
                      key={index}
                      className='prose dark:prose-dark w-full min-w-0 break-words !max-w-none text-text-primary select-text'
                    >
                      {part.text}
                    </article>
                  )
                }
              })}
          </Box>

          {message.parts.filter((part) => part.type === 'source').length > 0 && (
            <div className='grid gap-1'>
              <h2 className='text-text-primary font-medium'>{t('chat.sources')}</h2>

              <div className='flex gap-2 min-w-0 w-full rounded-full overflow-x-auto'>
                {message.parts
                  .filter((part) => part.type === 'source')
                  .map((part, index) => (
                    <a key={index} href={part.source.url} target='_blank' rel='noreferrer'>
                      <Box hover padding='tag'>
                        {part.source.title ?? new URL(part.source.url).hostname}
                      </Box>
                    </a>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className='pe-2 invisible opacity-0 transition-all duration-300 gap-2 flex group-hover:opacity-100 group-hover:visible'>
        {!skeleton && (
          <>
            <CopyButton variant='small' content={message.content} />

            <button
              type='button'
              onClick={async () => {
                const token = cookieMonster.get(CONSTANTS.COOKIES.TOKEN_NAME)
                if (token) {
                  handleMessagesChange(messages.filter((m) => m.id !== message.id))

                  await ChatAPIManager.deleteMessage(
                    {
                      locale,
                      token
                    },
                    chatId,
                    message.id
                  )
                }
              }}
            >
              <Trash size={16} />
            </button>
          </>
        )}

        {message.role === 'assistant' && (
          <p>{AIModels.getSafe(message.model as AIModelID)?.name || ''}</p>
        )}
      </div>
    </div>
  )
}
MessageBox.displayName = 'MessageBox'
