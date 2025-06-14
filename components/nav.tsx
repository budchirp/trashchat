import type React from 'react'
import { Container } from './container'
import { cn } from '@/lib/cn'

type NavProps = {
  children: React.ReactNode
  className?: string

  container?: boolean
  rounded?: boolean

  position?: 'top' | 'bottom'
  variant?: 'default' | 'blurry'
}

export const Nav: React.FC<NavProps> = ({
  children,
  className,
  container = true,
  rounded = false,
  position = 'top',
  variant = 'blurry'
}: NavProps): React.ReactNode => {
  const Component: any = container ? Container : 'div'

  return (
    <nav
      className={cn(
        'flex items-center sticky z-10 justify-center h-16 border-border',
        rounded && 'rounded-t-3xl',
        position === 'top' && 'top-0 border-b',
        position === 'bottom' && 'bottom-0 border-t',
        variant === 'blurry'
          ? 'backdrop-blur-sm  bg-background-primary/50'
          : 'bg-background-primary',
        className
      )}
    >
      <Component
        className={cn('flex items-center justify-between gap-2 h-16', !container && 'px-4 w-full')}
      >
        {children}
      </Component>
    </nav>
  )
}
