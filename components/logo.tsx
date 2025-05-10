import type React from 'react'
import type { ComponentProps } from 'react'

import { Link } from '@/lib/i18n/routing'
import { Env } from '@/lib/env'
import { cn } from '@/lib/cn'

export type LogoProps = Omit<ComponentProps<'h1'>, 'children'>

export const Logo: React.FC<LogoProps> = ({ className, ...props }: LogoProps): React.ReactNode => {
  return (
    <Link href='/'>
      <h1 {...props} className={cn('text-text-primary flex text-2xl font-bold', className)}>
        {Env.appName}
      </h1>
    </Link>
  )
}
