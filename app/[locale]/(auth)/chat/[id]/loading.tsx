'use client'

import type React from 'react'

import { Container } from '@/components/container'
import { MessageBox } from '@/components/chat/message-box'
import { ChatForm } from '@/components/chat/chat-form'
import { cn } from '@/lib/cn'

const Loading: React.FC = () => {
  return (
    <div className='flex size-full flex-col mt-4'>
      <Container className='flex flex-col gap-2 h-full'>
        {[...Array(4)].map((_, index) => (
          <MessageBox
            className={cn('animate-pulse', index % 2 === 0 ? 'w-2/4' : 'w-full')}
            key={index}
            message={
              {
                role: index % 2 === 0 ? 'user' : 'assistant',
                text: '',
                content: (
                  <div className='grid gap-2'>
                    {[...Array(index % 2 === 0 ? 1 : 4)].map((_, index) => (
                      <div key={index} className='bg-background-tertiary h-2 w-full rounded-sm' />
                    ))}
                  </div>
                )
              } as any
            }
          />
        ))}
      </Container>

      <ChatForm
        placeholder
        loading={true}
        isUploading={false}
        stop={() => {}}
        modelId={'gemini-2.0-flash'}
        input={''}
        files={[]}
        handleFilesChange={() => {}}
        handleModelChange={() => {}}
        handleInputChange={() => {}}
        handleSubmit={() => {}}
      />
    </div>
  )
}

export { Loading as ChatLoadingPage }
export default Loading
