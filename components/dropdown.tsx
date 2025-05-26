import type React from 'react'

import { MenuButton, Menu, MenuItems, MenuItem } from '@headlessui/react'
import { Box } from '@/components/box'
import { cn } from '@/lib/cn'

import type { LucideIcon } from 'lucide-react'

type DropdownProps = {
  options: (
    | {
        value: string
        title: string
        icon?: LucideIcon
      }
    | {
        children: React.ReactNode
      }
  )[]

  button: React.ReactNode

  position?: 'top' | 'bottom'
  padding?: number

  selected?: string | null | undefined
  onChange?: (option: string) => void
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,

  button,

  position = 'bottom',
  padding = 2,

  selected,
  onChange
}: DropdownProps): React.ReactNode => {
  return (
    <Menu as='div' className='relative w-fit'>
      <MenuButton as='div'>{button}</MenuButton>

      <MenuItems
        as={Box}
        transition
        className='absolute z-100 max-h-64 max-w-196 overflow-y-auto w-fit shadow-2xl origin-top transition-all duration-150 ease-out data-closed:ease-in data-closed:scale-95 data-closed:opacity-0'
        style={
          position === 'top'
            ? { bottom: `calc(var(--spacing) * ${padding + 8})`, right: 0 }
            : { top: `calc(var(--spacing) * ${padding + 8})`, left: 0 }
        }
        padding='none'
      >
        {options.map((option, index) => {
          const Icon = 'icon' in option ? option.icon : null

          return (
            <MenuItem
              as='div'
              className={cn(
                'border-b border-border min-w-0 first:rounded-t-3xl last:rounded-b-3xl last:border-none bg-background-primary px-4 py-2 items-center flex gap-2 transition-all duration-300 hover:bg-background-secondary',
                'value' in option && option.value === selected
                  ? 'bg-background-secondary text-text-accent-primary font-medium'
                  : 'text-text-tertiary hover:text-text-primary hover:font-medium'
              )}
              key={'value' in option ? option.value : index}
              onClick={() => ('value' in option && onChange ? onChange(option.value) : undefined)}
            >
              {Icon && <Icon size={16} />}

              {'title' in option ? option.title : option.children}
            </MenuItem>
          )
        })}
      </MenuItems>
    </Menu>
  )
}
