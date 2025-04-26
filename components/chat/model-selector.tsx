'use client'

import type React from 'react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import { Backdrop } from '@/components/backdrop'
import { Box } from '@/components/box'
import { Container } from '@/components/container'
import { cn } from '@/lib/cn'
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition
} from '@headlessui/react'
import { ChevronDown, Crown, DollarSign } from 'lucide-react'

import type { AIModelID, AIModelMap } from '@/lib/ai/models'

export type ModelSelectorProps = {
  model: AIModelID
  models: AIModelMap
  height: number
  onChange: (model: AIModelID) => void
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  model,
  models,
  height,
  onChange
}: ModelSelectorProps): React.ReactNode => {
  const [mounted, setMounted] = useState<boolean>(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Listbox value={model} onChange={onChange}>
      {({ open }) => {
        return (
          <div>
            {mounted &&
              createPortal(<Backdrop open={open} />, document.querySelector('#main') as Element)}

            <ListboxButton className='cursor-pointer' aria-label='Open model selector menu'>
              <span className='px-3 py-1 transition-all duration-150 rounded-lg bg-transparent hover:bg-background-secondary flex items-center gap-1'>
                {models[model].name}

                <ChevronDown />
              </span>
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
