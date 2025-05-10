'use client'

import type React from 'react'

import { Checkbox as HeadlessCheckbox, type CheckboxProps } from '@headlessui/react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'

export const Checkbox: React.FC<CheckboxProps> = ({
  className,
  checked = false,
  onChange = () => {},
  ...props
}: CheckboxProps): React.ReactNode => (
  <HeadlessCheckbox
    {...props}
    checked={checked}
    onChange={onChange}
    className={({ checked }) =>
      cn(
        'size-8 flex items-center justify-center bg-background-secondary hover:bg-background-tertiary relative transition-all duration-150 border border-border rounded-full p-1',
        checked &&
          'bg-background-accent-primary hover:bg-background-accent-secondary border-border-accent'
      )
    }
  >
    {({ checked }) => (
      <Check
        className={cn(
          'size-4 text-text-primary transition-all duration-150 opacity-0 invisible',
          checked && 'opacity-100 visible'
        )}
      />
    )}
  </HeadlessCheckbox>
)
Checkbox.displayName = 'Checkbox'
