'use client'

import type React from 'react'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/cn'
import { Check } from 'lucide-react'

export type CheckboxProps = {
  label: React.ReactNode
} & ComponentProps<'input'>

export const Checkbox: React.FC<CheckboxProps> = ({
  className,
  checked,
  onChange,
  label,
  ...props
}: CheckboxProps): React.ReactNode => (
  <label className='flex items-center gap-2'>
    <input {...props} checked={checked} onChange={onChange} className={cn('sr-only', className)} />

    <div
      className={cn(
        'size-8 flex items-center justify-center bg-background-secondary hover:bg-background-tertiary relative transition-all duration-150 border border-border rounded-xl',
        checked &&
          'bg-background-accent-primary hover:bg-background-accent-secondary border-border-accent'
      )}
    >
      <Check
        className={cn(
          'size-4 text-text-primary transition-all duration-150 opacity-0 invisible',
          checked && 'opacity-100 visible'
        )}
      />
    </div>

    {label}
  </label>
)
Checkbox.displayName = 'Checkbox'
