import type React from 'react'

import { Container } from '@/components/container'
import { Logo } from '@/components/logo'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

export const Footer: React.FC = async () => {
  const t = await getTranslations('common')

  return (
    <footer className='bg-background-primary/50 backdrop-blur-xs border-t border-border flex h-16 w-full items-center relative justify-center'>
      <Container className='flex h-full items-center text-center justify-between'>
        <Logo />

        <Link href='https://cankolay.com'>{t('footer')}</Link>
      </Container>
    </footer>
  )
}

Footer.displayName = 'Footer'
