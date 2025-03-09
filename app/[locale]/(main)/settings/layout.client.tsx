'use client'

import type React from 'react'

import { Heading } from '@/components/heading'
import { cn } from '@/lib/cn'
import { Link, usePathname } from '@/lib/i18n/routing'
import { useTranslations } from 'next-intl'

import type { RouteMap } from '@/types/route-map'

export const SettingsSection: React.FC = (): React.ReactNode => {
  const t = useTranslations()

  const routes: RouteMap = [
    {
      location: '',
      title: t('account.text')
    },
    {
      location: '/usages',
      title: t('usages.text')
    },
    {
      location: '/customization',
      title: t('customization.text')
    }
  ]

  const pathname = usePathname()

  return (
    <div className='grid'>
      <Heading className='text-lg mt-0'>{t('settings.text')}</Heading>

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
