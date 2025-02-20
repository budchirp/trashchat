import type React from 'react'

import { MetadataManager } from '@/lib/metadata-manager'
import { Link } from '@/lib/i18n/routing'
import { getTranslations } from 'next-intl/server'

import type { Metadata } from 'next'

const LandingPage: React.FC = async () => {
  const t = await getTranslations('landing')

  return (
    <div className='flex size-full flex-col mt-4'>
      <div className='w-full page-h-screen flex items-center justify-center'>
        <div className='text-center flex flex-col gap-2 items-center justify-center'>
          <h1 className='font-bold text-2xl'>{t('text')}</h1>
          <Link href='/chat'>{t('go-to-chat')}</Link>
        </div>
      </div>

      <div>Item</div>
    </div>
  )
}

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations('landing')

  return MetadataManager.generate(t('text'), t('description'))
}

export default LandingPage
