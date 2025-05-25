import type React from 'react'

import { Link } from '@/lib/i18n/routing'
import { cn } from '@/lib/cn'

type HeaderLinkProps = {
  href: string
  children: React.ReactNode
  selected: boolean
}

export const HeaderLink: React.FC<HeaderLinkProps> = ({
  href,
  children,
  selected
}: HeaderLinkProps): React.ReactNode => {
  return (
    <Link
      className={cn(
        'hover:text-text-primary transition-all duration-300 hover:font-bold',
        selected ? 'text-text-primary font-bold' : 'text-text-tertiary font-medium'
      )}
      href={href}
    >
      {children}
    </Link>
  )
}
