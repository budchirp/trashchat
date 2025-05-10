'use client'

import type React from 'react'

import { Link } from '@/lib/i18n/routing'
import { Button } from '@/components/button'
import { useTranslations } from 'next-intl'

const Unauthorized: React.FC = (): React.ReactNode => {
  const t = useTranslations()

  return (
    <div className='w-full h-screen flex items-center justify-center'>
      <div className='text-center flex flex-col gap-4 items-center justify-center'>
        <h1 className='text-lg font-medium'>{t('errors.unauthorized')}</h1>

        <div className='grid gap-2'>
          <Link href='/auth/signin'>
            <Button>{t('auth.signup.signin')}</Button>
          </Link>

          <Button
            color='secondary'
            onClick={() => {
              window?.location?.reload()
            }}
          >
            {t('common.refresh')}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Unauthorized
