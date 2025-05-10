import type React from 'react'
import type { ComponentProps } from 'react'

import { cva, type VariantProps } from 'class-variance-authority'
import { Button as HeadlessButton } from '@headlessui/react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/cn'

export const buttonVariants = cva(
  [
    'flex ease-out disabled:opacity-50 border active:scale-95 cursor-pointer items-center justify-center font-medium transition duration-300'
  ],
  {
    variants: {
      variant: {
        default: 'rounded-2xl px-5 py-1',
        round: 'size-10 aspect-square rounded-full p-2 text-2xl'
      },
      color: {
        primary:
          'bg-background-accent-primary border-border-accent text-gray-50 hover:bg-background-accent-secondary hover:text-gray-100 disabled:text-gray-200',
        secondary:
          'bg-background-primary border-border hover:bg-background-secondary hover:border-border-hover text-text-primary hover:text-text-secondary disabled:text-text-secondary',
        danger:
          'bg-red-600 hover:bg-red-700 border-red-500 hover:border-red-600 text-gray-50 hover:text-gray-100 disabled:text-gray-200'
      }
    },
    defaultVariants: {
      variant: 'default',
      color: 'primary'
    }
  }
)

export type ButtonProps = {
  children?: React.ReactNode
  loading?: boolean
} & ComponentProps<'button'> &
  VariantProps<typeof buttonVariants>

export const Button: React.FC<ButtonProps> = ({
  children,
  loading,
  className,
  variant,
  color,
  type,
  ...props
}: ButtonProps): React.ReactNode => {
  if (!children) loading = true

  return (
    <HeadlessButton
      {...props}
      type={type || 'button'}
      className={cn(buttonVariants({ className, variant, color }))}
    >
      {loading && <Loader2 className={cn('animate-spin text-xs', children ? 'mr-2' : '')} />}
      {children ?? ''}
    </HeadlessButton>
  )
}
Button.displayName = 'Button'
