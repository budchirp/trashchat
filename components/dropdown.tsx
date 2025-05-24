import type React from 'react'

import { MenuButton, Menu, MenuItems, MenuItem } from '@headlessui/react'
import { Box } from './box'
import { cn } from '@/lib/cn'

import type { LucideIcon } from 'lucide-react'

type DropdownProps = {
  options: {
    value: string
    title: string
    icon?: LucideIcon
  }[]

  button: React.ReactNode

  selected: string | null | undefined
  onChange: (option: string) => void
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  button,
  selected,
  onChange
}: DropdownProps): React.ReactNode => {
  return (
    <Menu as='div' className='relative w-fit'>
      <MenuButton as='div'>{button}</MenuButton>
      <MenuItems
        as={Box}
        transition
        className='absolute left-0 max-h-64 overflow-y-auto top-10 z-10 w-fit origin-top transition-all duration-150 ease-out data-closed:ease-in data-closed:scale-95 data-closed:opacity-0'
        padding='none'
      >
        {options.map((option) => {
          const Icon = option.icon

          return (
            <MenuItem
              as='div'
              className={cn(
                'border-b border-border last:border-none bg-background-primary px-4 py-2 items-center flex gap-2 transition-all duration-300 hover:bg-background-secondary',
                option.value === selected
                  ? 'bg-background-secondary text-text-accent-primary font-medium'
                  : 'text-text-tertiary hover:text-text-primary hover:font-medium'
              )}
              key={option.value}
              onClick={() => onChange(option.value)}
            >
              {Icon && <Icon size={16} />}

              {option.title}
            </MenuItem>
          )
        })}
      </MenuItems>
    </Menu>
  )
}
