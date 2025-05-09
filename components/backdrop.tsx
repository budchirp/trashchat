import type React from 'react'
import type { ComponentProps } from 'react'

import { Transition } from '@headlessui/react'
import { cn } from '@/lib/cn'

export type BackdropProps = {
  fullscreen?: boolean
  open: boolean
  onClose?: () => void
} & ComponentProps<'div'>

export const Backdrop: React.FC<BackdropProps> = ({
  fullscreen = true,
  open,
  onClose,
  className,
  ...props
}: BackdropProps): React.ReactNode => (
  <Transition
    {...props}
    show={open}
    as='div'
    onClick={onClose}
    className={cn(
      'transition-all bg-black opacity-50 overflow-hidden .backdrop-blur-sm',
      'data-closed:opacity-0 data-closed:.backdrop-blur-none',
      'data-enter:ease-out data-enter:duration-400',
      'data-leave:ease-in data-leave:duration-200',
      fullscreen && 'h-screen fixed inset-0 z-10 w-screen',
      className
    )}
  />
)
