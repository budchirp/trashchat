import type React from 'react'

import { getTranslations, setRequestLocale } from 'next-intl/server'
import { MetadataManager } from '@/lib/metadata-manager'
import { Link } from '@/lib/i18n/routing'
import { routing } from '@/lib/i18n/routing'
import { Button } from '@/components/button'
import { Logo } from '@/components/logo'

import type { Metadata } from 'next'
import type { DynamicPageProps } from '@/types/page'

const LandingPage: React.FC<DynamicPageProps> = async ({ params }: DynamicPageProps) => {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({
    namespace: 'landing',
    locale
  })

  return (
    <div className='flex size-full flex-col mt-4'>
      <div className='w-full page-h-screen flex items-center justify-center'>
        <div className='text-center flex flex-col gap-4 items-center justify-center'>
          <div className='text-lg flex items-center justify-center text-center gap-1 flex-col font-medium'>
            <Logo />

            <p className=''>{t('description')}</p>
          </div>

          <Button>
            <Link href='/chat'>{t('go-to-chat')}</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export const generateMetadata = async ({ params }: DynamicPageProps): Promise<Metadata> => {
  const { locale } = await params

  const t = await getTranslations({
    namespace: 'landing',
    locale
  })
  return MetadataManager.generate(t('text'), t('description'))
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default LandingPage
