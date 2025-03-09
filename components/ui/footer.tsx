import type React from 'react'

import { Container } from '@/components/container'
import { Logo } from '@/components/logo'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/lib/i18n/routing'

import type { RouteMap } from '@/types/route-map'

export const Footer: React.FC = async () => {
  const t = await getTranslations('common')
  const t_all = await getTranslations()

  const routes: RouteMap = [
    {
      location: '/legal/privacy-policy',
      title: t_all('legal.privacy-policy.text')
    }
  ]

  return (
    <footer className='bg-background-primary/50 backdrop-blur-xs border-t border-border flex w-full items-center relative justify-center'>
      <Container className='grid gap-2'>
        <div className='min-h-16 flex flex-col border-b border-border md:flex-row md:items-center justify-between gap-2'>
          <Logo />

          <Link href='https://cankolay.com'>{t('footer')}</Link>
        </div>

        <div className='flex items-center pb-2 justify-between gap-2'>
          <div />

          <div className='justify-end flex flex-col text-end'>
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

Footer.displayName = 'Footer'
