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
import { Crown, DollarSign, EllipsisVertical, type LucideIcon } from 'lucide-react'
import { Backdrop } from '@/components/backdrop'
import { Button } from '@/components/button'
import { Container } from '@/components/container'

import { AIModels, type AIModelID } from '@/lib/ai/models'

export type ModelSelectorProps = {
  input: string
  model: AIModelID
  onChange: (model: AIModelID) => void
  chatFormRef: Ref<HTMLDivElement>
}

const models = AIModels.get(false)

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
                    'w-full md:w-3/4 right-0 h-screen_ flex justify-center bottom-0 items-center origin-[25%_100%] md:origin-[5%_100%] z-20 mx-auto fixed',
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
                    className='fixed flex h-min justify-start items-center'
                  >
                    <ListboxOptions
                      static
                      as={Box}
                      variant='primary'
                      padding='none'
                      className='min-w-32 max-w-64 overflow-hidden'
                    >
                      {(Object.keys(models) as AIModelID[]).map((modelId: AIModelID) => {
                        return (
                          <ListboxOption
                            key={modelId}
                            className={({ selected }) =>
                              cn(
                                'border-border h-12 flex w-full cursor-pointer items-center border-b px-4 py-2 transition duration-300 last:border-none',
                                selected
                                  ? 'bg-background-secondary'
                                  : 'bg-background-primary hover:bg-background-secondary'
                              )
                            }
                            value={modelId}
                          >
                            {({ selected }) => {
                              const model = models[modelId]

                              return (
                                <div
                                  className={cn(
                                    'flex justify-between gap-4 h-full w-full items-center'
                                  )}
                                >
                                  <p
                                    className={cn(
                                      'font-medium transition duration-300',
                                      selected
                                        ? 'text-text-accent-primary'
                                        : 'text-text-primary hover:text-text-secondary'
                                    )}
                                  >
                                    {model.name}
                                  </p>

                                  <div className='flex gap-2'>
                                    {model.plus && (
                                      <div className='size-8 border border-border p-2 flex items-center justify-center rounded-lg'>
                                        <Crown />
                                      </div>
                                    )}

                                    {model.premium && (
                                      <div className='size-8 border border-border p-2 flex items-center justify-center rounded-lg'>
                                        <DollarSign />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )
                            }}
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
