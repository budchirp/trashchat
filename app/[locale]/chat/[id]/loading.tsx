'use client'

import type React from 'react'

import { Container } from '@/components/container'
import { MessageBox } from '@/components/chat/message-box'
import { ChatForm } from '@/components/chat/chat-form'

const Loading: React.FC = () => {
  return (
    <div className='flex size-full flex-col mt-4'>
      <Container className='flex flex-col gap-2 h-full'>
        {[...Array(4)].map((_, index) => {
          return (
            <MessageBox
              className='animate-pulse'
              key={index}
              message={
                {
                  role: index % 2 === 0 ? 'user' : 'assistant',
                  content: (
                    <div className='grid gap-1.5'>
                      <div className='bg-background-tertiary h-2 w-full rounded-sm' />
                      <div className='bg-background-tertiary h-2 w-full rounded-sm' />
                      {index % 2 !== 0 && (
                        <>
                          <div className='bg-background-tertiary h-2 w-full rounded-sm' />
                          <div className='bg-background-tertiary h-2 w-full rounded-sm' />
                          <div className='bg-background-tertiary h-2 w-full rounded-sm' />
                          <div className='bg-background-tertiary h-2 w-full rounded-sm' />
                        </>
                      )}
                    </div>
                  )
                } as any
              }
            />
          )
        })}
      </Container>

      <ChatForm
        placeholder
        loading={true}
        isUploading={false}
        stop={() => {}}
        model={'gemini-2.0-flash'}
        input={''}
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
