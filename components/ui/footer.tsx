import type React from 'react'

import { getTranslations } from 'next-intl/server'
import { Container } from '@/components/container'
import { Link } from '@/lib/i18n/routing'
import { Logo } from '@/components/logo'

import type { Routes } from '@/types/routes'

export const Footer: React.FC = async () => {
  const t = await getTranslations()

  const routes: Routes = [
    {
      location: '/legal/privacy-policy',
      title: t('legal.privacy-policy.text')
    },
    {
      location: '/legal/terms-of-service',
      title: t('legal.terms-of-service.text')
    }
  ]

  return (
    <footer className='bg-background-primary/50 backdrop-blur-sm border-t border-border flex w-full items-center relative justify-center'>
      <Container>
        <div className='flex border-b border-border min-h-16 py-4 flex-col md:flex-row md:items-center md:justify-between gap-1'>
          <Logo />

          <Link className='font-medium text-text-accent-secondary' href='https://cankolay.com'>
            {t('ui.footer')}
          </Link>
        </div>

        <div className='items-center min-h-16 py-4 flex justify-between gap-1'>
          <div />

          <div className='justify-end flex flex-col gap-2 text-end'>
            {routes.map((route) => {
              return (
                <Link
                  href={route.location}
                  className='hover:text-text-primary transition-all duration-300 hover:font-bold text-text-tertiary font-medium'
                  key={route.location}
                >
                  {route.title}
                </Link>
              )
            })}
          </div>
        </div>
      </Container>
    </footer>
  )
}
