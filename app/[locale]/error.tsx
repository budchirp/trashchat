'use client'

import type React from 'react'

import { Link, useRouter } from '@/lib/i18n/routing'
import { useLogout } from '@/lib/helpers/use-logout'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/button'

import type { ErrorProps } from '@/types/error'

const Error: React.FC<ErrorProps> = ({ error }: ErrorProps): React.ReactNode => {
  const t = useTranslations()

  const router = useRouter()

  const logout = useLogout()

  return (
    <div className='w-full h-screen flex items-center justify-center'>
      <div className='text-center flex flex-col gap-4 items-center justify-center'>
        <h1 className='text-lg font-medium'>
          {error.message === 'token' ? t('errors.token') : t('errors.error')}
        </h1>

        {process.env.NODE_ENV === 'development' && (
          <div>
            <p>{error.message}</p>
            <p>{error.stack}</p>
            <p>{JSON.stringify(error.cause)}</p>
          </div>
        )}

        <div className='flex items-center justify-center gap-2'>
          <Link href='/'>
            <Button>{t('common.go-to-home')}</Button>
          </Link>

          <Button color='secondary' onClick={logout}>
            {t('auth.logout')}
          </Button>

          <Button
            color='secondary'
            onClick={() => {
              router.refresh()
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
