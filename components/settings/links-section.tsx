'use client'

import type React from 'react'

import { HeaderLink } from '@/components/header-link'
import { usePathname } from '@/lib/i18n/routing'
import { Heading } from '@/components/heading'
import { useTranslations } from 'next-intl'

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
          <HeaderLink href={location} selected={pathname === location} key={location}>
            {route.title}
          </HeaderLink>
        )
      })}
    </div>
  )
}
