'use client'

import type React from 'react'

import { Link, usePathname } from '@/lib/i18n/routing'
import { Heading } from '@/components/heading'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/cn'

import type { Routes } from '@/types/routes'

export const SettingsLinksSection: React.FC = (): React.ReactNode => {
  const t = useTranslations('settings')

  const routes: Routes = [
    {
      location: '',
      title: t('account.text')
    },
    {
      location: '/security',
      title: t('security.text')
    },
    {
      location: '/usages',
      title: t('usages.text')
    },
    {
      location: '/customization',
      title: t('customization.text')
    },
    {
      location: '/appearance',
      title: t('appearance.text')
    }
  ]

  const pathname = usePathname()

  return (
    <div className='grid'>
      <Heading className='text-lg mt-0'>{t('text')}</Heading>

      {routes.map((route) => {
        const location = `/settings${route.location}`

        return (
          <Link
            href={location}
            className={cn(
              'hover:text-text-primary transition-all duration-300 hover:font-bold',
              pathname === location
                ? 'text-text-primary font-bold'
                : 'text-text-tertiary font-medium'
            )}
            key={route.location}
          >
            {route.title}
          </Link>
        )
      })}
    </div>
  )
}
