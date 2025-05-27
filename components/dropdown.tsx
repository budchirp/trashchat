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
        icon?: LucideIcon
        children: React.ReactNode
        onClick?: () => void
      }
  )[]

  relative?: boolean

  button: React.ReactNode

  position?: 'top' | 'bottom'
  padding?: number

  selected?: string | null | undefined
  onChange?: (option: string) => void
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,

  relative = true,

  button,

  position = 'bottom',
  padding = 2,

  selected,
  onChange
}: DropdownProps): React.ReactNode => {
  return (
    <Menu as='div' className={cn(relative && 'relative')}>
      <MenuButton as='div'>{button}</MenuButton>

      <MenuItems
        as={Box}
        transition
        className='absolute z-10 w-fit max-h-64 overflow-x-hidden overflow-y-auto shadow-2xl transition-all duration-150 ease-out data-closed:ease-in data-closed:scale-95 data-closed:opacity-0'
        style={
          position === 'top'
            ? {
                bottom: `calc(var(--spacing) * ${padding + 8})`,
                right: 0,
                transformOrigin: 'bottom'
              }
            : { top: `calc(var(--spacing) * ${padding + 8})`, left: 0, transformOrigin: 'top' }
        }
        variant='blurry'
        padding='none'
      >
        {options.map((option, index) => {
          const Icon = 'icon' in option ? option.icon : null

          return (
            <MenuItem
              as='div'
              className={cn(
                'border-b border-border last:border-none bg-transparent px-4 py-3 items-center flex gap-2 transition-all duration-300 hover:bg-background-secondary',
                'value' in option && option.value === selected
                  ? 'bg-background-secondary text-text-accent-primary font-medium'
                  : 'text-text-tertiary hover:text-text-primary'
              )}
              key={'value' in option ? option.value : index}
              onClick={() =>
                ('value' in option && onChange && onChange(option.value)) ||
                ('onClick' in option && option.onClick && option.onClick())
              }
            >
              <div className='aspect-square size-6 flex items-center justify-center'>
                {Icon && <Icon size={16} />}
              </div>

              <span>{'title' in option ? option.title : option.children}</span>
            </MenuItem>
          )
        })}
      </MenuItems>
    </Menu>
  )
}
