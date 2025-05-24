'use client'

import type React from 'react'
import { Fragment, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import { Gauge, Rabbit, Snail, Zap, type LucideIcon } from 'lucide-react'
import { Container } from '@/components/container'
import { Backdrop } from '@/components/backdrop'
import { Button } from '@/components/button'
import { useTranslations } from 'next-intl'
import { Box } from '@/components/box'
import { cn } from '@/lib/cn'
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition
} from '@headlessui/react'

import type { AIModelReasoningOption } from '@/lib/ai/models'

export const reasoningEfforts: {
  [key in AIModelReasoningOption]: [(t: (value: string) => string) => string, LucideIcon]
} = {
  low: [(t) => t('low'), Rabbit],
  medium: [(t) => t('medium'), Gauge],
  high: [(t) => t('high'), Snail]
}

type ReasoningEffortSelectorProps = {
  height: number

  reasoningEffort: AIModelReasoningOption | null
  onReasoningEffortChange: (value: AIModelReasoningOption | null) => void
}

export const ReasoningEffortSelector: React.FC<ReasoningEffortSelectorProps> = ({
  height,

  reasoningEffort,
  onReasoningEffortChange
}: ReasoningEffortSelectorProps): React.ReactNode => {
  const [mounted, setMounted] = useState<boolean>(false)
  useEffect((): void => {
    setMounted(true)
  }, [])

  const t = useTranslations('chat.reasoning-effort')

  return (
    <Listbox value={reasoningEffort} onChange={onReasoningEffortChange}>
      {({ open }) => {
        const Icon: LucideIcon = reasoningEffort ? reasoningEfforts[reasoningEffort][1] : Zap

        return (
          <div>
            {mounted &&
              createPortal(<Backdrop open={open} />, document.querySelector('#main') as Element)}

            <ListboxButton as={Fragment}>
              <Button
                loading={!mounted}
                aria-label='Open reasoning effort selector menu'
                variant='round'
                color={reasoningEffort ? 'primary' : 'secondary'}
              >
                <Icon />
              </Button>
            </ListboxButton>

            <Transition
              show={open}
              as='div'
              className={cn(
                'w-full left-0 bottom-0 h-screen_ flex justify-center items-center origin-[25%_100%] md:origin-[25%_100%] z-20 mx-auto fixed',
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
                className='fixed h-min flex justify-start items-center'
              >
                <ListboxOptions
                  static
                  as={Box}
                  variant='primary'
                  padding='none'
                  className='min-w-32 w-fit'
                >
                  <div>
                    {(Object.keys(reasoningEfforts) as AIModelReasoningOption[]).map(
                      (reasoningEffort) => {
                        const [label, Icon] = reasoningEfforts[reasoningEffort]

                        return (
                          <ListboxOption
                            key={reasoningEffort}
                            aria-label={label(t)}
                            value={reasoningEffort}
                            className={({ selected }) =>
                              cn(
                                'border-border flex gap-2 h-min w-full cursor-pointer items-center border-b px-4 py-2 transition duration-300 last:border-none',
                                selected
                                  ? 'bg-background-secondary text-text-accent-primary'
                                  : 'bg-background-primary hover:bg-background-secondary text-text-primary hover:text-text-secondary'
                              )
                            }
                          >
                            <Icon />

                            <span>{label(t)}</span>
                          </ListboxOption>
                        )
                      }
                    )}
                  </div>
                </ListboxOptions>
              </Container>
            </Transition>
          </div>
        )
      }}
    </Listbox>
  )
}
ReasoningEffortSelector.displayName = 'ReasoningEffortSelector'
