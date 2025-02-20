import type React from 'react'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/cn'
import { appName } from '@/data'
import { Link } from '@/lib/i18n/routing'

export type LogoProps = {} & Omit<ComponentProps<'h1'>, 'children'>

export const Logo: React.FC<LogoProps> = ({ className, ...props }: LogoProps): React.ReactNode => {
  return (
    <Link href='/'>
      <h1
        {...props}
        className={cn(
          'text-text-primary flex h-full items-center justify-center text-2xl font-bold',
          className
        )}
      >
        {appName}
      </h1>
    </Link>
  )
}
Logo.displayName = 'Logo'
