'use client'

import type React from 'react'
import { useEffect, useState, use } from 'react'
import { createPortal } from 'react-dom'

import { SidebarContext } from '@/providers/context/sidebar'
import { AIModels, type AIModelID } from '@/lib/ai/models'
import { UserContext } from '@/providers/context/user'
import { Container } from '@/components/container'
import { Backdrop } from '@/components/backdrop'
import { Box } from '@/components/box'
import { cn } from '@/lib/cn'
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition
} from '@headlessui/react'
import {
  ChevronDown,
  Crown,
  DollarSign,
  FlaskConical,
  ThumbsUp,
  Camera,
  File,
  Brain,
  Search
} from 'lucide-react'

export type ModelSelectorProps = {
  height: number

  model: AIModelID
  onModelChange: (model: AIModelID) => void
}

const models = AIModels.getAll()

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  height,

  model,
  onModelChange
}: ModelSelectorProps): React.ReactNode => {
  const [mounted, setMounted] = useState<boolean>(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const { user } = use(UserContext)
  const { showSidebar } = use(SidebarContext)

  const selectedModel = AIModels.get(model)

  return (
    <Listbox value={model} onChange={onModelChange}>
      {({ open }) => (
        <div>
          {mounted &&
            createPortal(<Backdrop open={open} />, document.querySelector('#main') as Element)}

          <ListboxButton
            className='px-4 h-10 transition-all duration-150 rounded-lg bg-transparent hover:bg-background-secondary flex items-center gap-1 cursor-pointer'
            aria-label='Open model selector menu'
          >
            {selectedModel.name}

            <ChevronDown />
          </ListboxButton>

          {mounted &&
            createPortal(
              <Transition
                show={open}
                as='div'
                className={cn(
                  'bottom-0 h-screen_ flex justify-center items-center origin-[25%_100%] md:origin-[25%_100%] z-20 mx-auto fixed',
                  'transition-all scale-100 opacity-100',
                  'data-closed:scale-90 data-closed:opacity-0',
                  'data-enter:ease-out data-enter:duration-400',
                  'data-leave:ease-in data-leave:duration-200',
                  showSidebar ? 'w-full right-0 md:w-3/4' : 'w-full'
                )}
              >
                <Container
                  style={{
                    bottom: `calc(${height}px + 1rem)`
                  }}
                  className='fixed h-min flex justify-start items-center'
                >
                  <ListboxOptions
                    static
                    as={Box}
                    variant='primary'
                    padding='none'
                    className='min-w-32 w-fit max-w-128 max-h-96 overflow-x-hidden overflow-y-auto'
                  >
                    <div className='grid grid-cols-2 md:grid-cols-3 gap-4 p-4'>
                      {(Object.keys(models) as AIModelID[]).map((modelId: AIModelID) => {
                        const model = AIModels.get(modelId)

                        return (
                          <ListboxOption
                            disabled={model.plus && !user?.subscription}
                            key={modelId}
                            value={modelId}
                            className={({ selected }) =>
                              cn(
                                'border-border data-disabled:opacity-50 data-disabled:pointer-events-none p-4 cursor-pointer rounded-2xl w-full transition border duration-300',
                                selected
                                  ? 'bg-background-secondary'
                                  : 'bg-background-primary hover:bg-background-secondary'
                              )
                            }
                          >
                            {({ selected }) => {
                              return (
                                <div
                                  className={cn('gap-4 flex flex-col items-center justify-center')}
                                >
                                  <p
                                    className={cn(
                                      'transition text-center duration-300',
                                      selected
                                        ? 'text-text-accent-primary font-bold'
                                        : model.recommended
                                          ? 'font-bold text-text-primary'
                                          : 'font-medium text-text-secondary'
                                    )}
                                  >
                                    {model.name}
                                  </p>

                                  <div className='flex items-center flex-wrap justify-center gap-2'>
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

                                    {model.recommended && (
                                      <div className='size-8 border border-border p-2 flex items-center justify-center rounded-lg'>
                                        <ThumbsUp />
                                      </div>
                                    )}

                                    {model.experimental && (
                                      <div className='size-8 border border-border p-2 flex items-center justify-center rounded-lg'>
                                        <FlaskConical />
                                      </div>
                                    )}

                                    {model.reasoning && (
                                      <div className='size-8 border border-border p-2 flex items-center justify-center rounded-lg'>
                                        <Brain />
                                      </div>
                                    )}

                                    {model.search && (
                                      <div className='size-8 border border-border p-2 flex items-center justify-center rounded-lg'>
                                        <Search />
                                      </div>
                                    )}

                                    {model.imageUpload && (
                                      <div className='size-8 border border-border p-2 flex items-center justify-center rounded-lg'>
                                        <Camera />
                                      </div>
                                    )}

                                    {model.fileUpload && (
                                      <div className='size-8 border border-border p-2 flex items-center justify-center rounded-lg'>
                                        <File />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )
                            }}
                          </ListboxOption>
                        )
                      })}
                    </div>
                  </ListboxOptions>
                </Container>
              </Transition>,
              document.querySelector('#main') as Element
            )}
        </div>
      )}
    </Listbox>
  )
}
ModelSelector.displayName = 'ModelSelector'
