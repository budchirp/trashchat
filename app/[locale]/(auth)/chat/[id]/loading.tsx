'use client'

import type React from 'react'

import { MessageBox } from '@/components/chat/message-box'
import { ChatForm } from '@/components/chat/chat-form'
import { Container } from '@/components/container'
import { cn } from '@/lib/cn'

const Loading: React.FC = () => {
  return (
    <div className='flex size-full flex-col mt-4'>
      <Container className='flex flex-col gap-2 h-full'>
        {[...Array(4)].map((_, index) => (
          <MessageBox
            className={index % 2 === 0 ? 'w-2/4' : 'w-full'}
            key={index}
            message={
              {
                role: index % 2 === 0 ? 'user' : 'assistant',
                parts: [
                  {
                    type: 'text',
                    text: (
                      <div className='grid gap-2'>
                        {[...Array(index % 2 === 0 ? 1 : 4)].map((_, index) => (
                          <div
                            key={index}
                            className='bg-background-tertiary h-2 w-full rounded-sm animate-pulse'
                          />
                        ))}
                      </div>
                    )
                  }
                ]
              } as any
            }
          />
        ))}
      </Container>

      <ChatForm
        isSkeleton
        loading={true}
        isUploading={false}
        stop={() => {}}
        modelId={'gemini-2.0-flash'}
        input={''}
        files={[]}
        reasoningEffort={null}
        useReasoning={false}
        useSearch={false}
        handleReasoningEffortChange={() => {}}
        handleUseReasoningChange={() => {}}
        handleUseSearchChange={() => {}}
        handleFilesChange={() => {}}
        handleModelIdChange={() => {}}
        handleInputChange={() => {}}
        handleSubmit={() => {}}
      />
    </div>
  )
}

export { Loading as ChatLoadingPage }
export default Loading
