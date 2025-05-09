'use client'

import type React from 'react'

import type { ErrorProps } from '@/types/error'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/button'
import { Link, useRouter } from '@/lib/i18n/routing'
import { SessionAPIManager } from '@/lib/api/session'
import { toast } from 'sonner'

const Error: React.FC<ErrorProps> = ({ error }: ErrorProps): React.ReactNode => {
  const t = useTranslations()

  const router = useRouter()

  const isTokenError = error.message === 'token'

  return (
    <div className='w-full h-screen flex items-center justify-center'>
      <div className='text-center flex flex-col gap-4 items-center justify-center'>
        <h1 className='text-lg font-medium'>
          {isTokenError ? t('erorrs.sneaky') : t('errors.error')}
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

          {isTokenError && (
            <Button
              color='secondary'
              onClick={async () => {
                await SessionAPIManager.delete()

                toast(t('common.success'))

                router.push('/')
              }}
            >
              {t('auth.logout')}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Error
