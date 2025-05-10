import type React from 'react'
import type { ComponentProps } from 'react'

import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const boxVariants = cva(
  ['w-full rounded-3xl border border-border transition-all duration-300 overflow-hidden'],
  {
    variants: {
      variant: {
        primary: 'bg-background-primary',
        secondary: 'bg-background-secondary'
      },
      padding: {
        default: 'px-4 py-3',
        small: 'p-2',
        tag: 'px-4 py-1 rounded-full',
        none: ''
      },
      hover: {
        true: 'cursor-pointer hover:bg-background-tertiary',
        false: ''
      }
    },
    defaultVariants: {
      padding: 'default',
      variant: 'secondary'
    }
  }
)

export type BoxProps = ComponentProps<'div'> & VariantProps<typeof boxVariants>

export const Box: React.FC<BoxProps> = ({
  children,
  className,
  padding,
  variant,
  hover,
  ...props
}: BoxProps): React.ReactNode => (
  <div {...props} className={cn(boxVariants({ className, padding, variant, hover }))}>
    {children}
  </div>
)
