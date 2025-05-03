import type React from 'react'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/cn'
import { Transition } from '@headlessui/react'

export type BackdropProps = {
  open: boolean
  onClose?: () => void
} & ComponentProps<'div'>

export const Backdrop: React.FC<BackdropProps> = ({
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
      'transition-all bg-black opacity-50 .backdrop-blur-sm h-screen fixed inset-0 z-10 w-screen',
      'data-closed:opacity-0 data-closed:.backdrop-blur-none',
      'data-enter:ease-out data-enter:duration-400',
      'data-leave:ease-in data-leave:duration-200',
      className
    )}
  />
)
