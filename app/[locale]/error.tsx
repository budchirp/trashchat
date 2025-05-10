'use client'

import type React from 'react'

import { useLogout } from '@/lib/helpers/use-logout'
import { Button } from '@/components/button'
import { useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n/routing'

import type { ErrorProps } from '@/types/error'

const Error: React.FC<ErrorProps> = ({ error }: ErrorProps): React.ReactNode => {
  const t = useTranslations()

  const logout = useLogout()
  if (error.message === 'token') {
    logout()
  }

  return (
    <div className='w-full h-screen flex items-center justify-center'>
      <div className='text-center flex flex-col gap-4 items-center justify-center'>
        <h1 className='text-lg font-medium'>
          {error.message === 'token' ? t('errors.token') : t('errors.error')}
        </h1>

        {process.env.NODE_ENV === 'development' && (
          <>
            <p>{error.message}</p>
            <p>{error.stack}</p>
          </>
        )}

        <div className='flex items-center justify-center gap-2'>
          <Link href='/'>
            <Button>{t('common.go-to-home')}</Button>
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

export default Error
