'use client'

import type React from 'react'

import { useTranslations } from 'next-intl'
import { Button } from '@/components/button'
import { Link } from '@/lib/i18n/routing'

const Unauthorized: React.FC = (): React.ReactNode => {
  const t = useTranslations()

  return (
    <div className='w-full h-screen flex items-center justify-center'>
      <div className='text-center flex flex-col gap-4 items-center justify-center'>
        <h1 className='text-lg font-medium'>{t('errors.unauthorized')}</h1>

        <Link href='/auth/signin'>
          <Button>{t('auth.signup.signin')}</Button>
        </Link>
      </div>
    </div>
  )
}

export default Unauthorized
