import type React from 'react'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/cn'
import { cva, type VariantProps } from 'class-variance-authority'

const boxVariants = cva(['w-full rounded-3xl transition-all duration-300'], {
  variants: {
    variant: {
      primary: 'bg-background-primary border border-border',
      secondary: 'bg-background-secondary'
    },
    padding: {
      default: 'px-4 py-3',
      small: 'p-2',
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
})

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

Box.displayName = 'Box'
