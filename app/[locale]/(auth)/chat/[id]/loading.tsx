'use client'

import type React from 'react'

import { MessageBox } from '@/components/chat/message-box'
import { ChatForm } from '@/components/chat/form'
import { Container } from '@/components/container'
import { CONSTANTS } from '@/lib/constants'

const Loading: React.FC = () => {
  return (
    <div className='flex size-full flex-col mt-4'>
      <Container className='flex flex-col gap-2 h-full'>
        {[...Array(4)].map((_, index) => (
          <MessageBox
            key={index}
            skeleton
            chatId={''}
            messages={[]}
            handleMessagesChange={() => {}}
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
        skeleton
        loading={true}
        isUploading={false}
        stop={() => {}}
        selectedModel={CONSTANTS.AI.DEFAULT_MODEL}
        input={''}
        files={[]}
        reasoningEffort={null}
        useReasoning={false}
        useSearch={false}
        handleReasoningEffortChange={() => {}}
        handleUseReasoningChange={() => {}}
        handleUseSearchChange={() => {}}
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
