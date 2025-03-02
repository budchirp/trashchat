'use client'

import type React from 'react'
import { Fragment, useEffect, useState, type Ref } from 'react'
import { createPortal } from 'react-dom'

import { Box } from '@/components/box'
import { cn } from '@/lib/cn'
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition
} from '@headlessui/react'
import { EllipsisVertical, type LucideIcon } from 'lucide-react'
import { Backdrop } from '@/components/backdrop'
import { Button } from '@/components/button'
import { Container } from '@/components/container'

export type ModelSelectorProps = {
  input: string
  model: ModelName
  onChange: (model: ModelName) => void
  chatFormRef: Ref<HTMLDivElement>
}

export const modelNames = {
  'gemini-2.0-flash': 'Gemini 2.0 Flash',
  'deepseek-r1': 'DeepSeek R1 (broken)',
  'openai-4o-mini': 'OpenAI 4o-mini (disabled)'
}

export type ModelName = keyof typeof modelNames

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  input,
  model,
  onChange,
  chatFormRef
}: ModelSelectorProps): React.ReactNode => {
  const [height, setHeight] = useState<number>(0)
  const changeHeight = () => {
    // @ts-ignore
    if (chatFormRef && chatFormRef.current) {
      // @ts-ignore
      setHeight(chatFormRef.current.clientHeight)
    }
  }

  const [mounted, setMounted] = useState<boolean>(false)
  useEffect(() => {
    setMounted(true)

    changeHeight()
  }, [])

  useEffect(() => {
    changeHeight()
  }, [input])

  return (
    <Listbox value={model} onChange={onChange}>
      {({ open }) => {
        const Icon: LucideIcon | null = mounted ? EllipsisVertical : null

        useEffect(() => {
          changeHeight()
        }, [open])

        return (
          <div>
            {mounted &&
              createPortal(
                <Backdrop
                  style={{
                    height: `calc(100vh - 4rem - 1px - ${height}px)`
                  }}
                  open={open}
                />,
                document.querySelector('#main') as Element
              )}

            <ListboxButton as={Fragment}>
              <Button
                loading={!mounted}
                aria-label='Open model selector menu'
                variant='round'
                color='secondary'
              >
                {Icon ? <Icon /> : null}
              </Button>
            </ListboxButton>

            {mounted &&
              createPortal(
                <Transition
                  show={open}
                  as='div'
                  className={cn(
                    'w-3/4 right-0 h-screen_ flex justify-center bottom-0 items-center origin-[25%_100%] md:origin-[5%_100%] z-20 mx-auto fixed',
                    'transition-all scale-100 opacity-100',
                    'data-closed:scale-90 data-closed:opacity-0',
                    'data-enter:ease-out data-enter:duration-400',
                    'data-leave:ease-in data-leave:duration-200'
                  )}
                >
                  <Container
                    style={{
                      bottom: `calc(${height}px + 1rem)`
                    }}
                    className='fixed w-full flex h-min justify-start items-center'
                  >
                    <ListboxOptions
                      static
                      as={Box}
                      variant='primary'
                      padding='none'
                      className='min-w-32 max-w-48 md:max-w-64 overflow-hidden'
                    >
                      {(Object.keys(modelNames) as ModelName[]).map((modelId: ModelName) => {
                        return (
                          <ListboxOption
                            key={modelId}
                            className={({ selected }) =>
                              cn(
                                'border-border flex h-min w-full cursor-pointer items-center border-b px-4 py-2 transition duration-300 last:border-none',
                                selected
                                  ? 'bg-background-secondary'
                                  : 'bg-background-primary hover:bg-background-secondary'
                              )
                            }
                            value={modelId}
                          >
                            {({ selected }) => (
                              <p
                                className={cn(
                                  'flex h-full w-full items-center font-medium transition duration-300',
                                  selected
                                    ? 'text-text-accent-primary'
                                    : 'text-text-primary hover:text-text-secondary'
                                )}
                              >
                                {modelNames[modelId]}
                              </p>
                            )}
                          </ListboxOption>
                        )
                      })}
                    </ListboxOptions>
                  </Container>
                </Transition>,
                document.querySelector('#main') as Element
              )}
          </div>
        )
      }}
    </Listbox>
  )
}
ModelSelector.displayName = 'ModelSelector'
