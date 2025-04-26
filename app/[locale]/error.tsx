'use client'

import type React from 'react'

import type { ErrorProps } from '@/types/error'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/button'
import { Link, useRouter } from '@/lib/i18n/routing'
import { SessionAPIManager } from '@/lib/api/session'
import { toast } from 'sonner'

const Error: React.FC<ErrorProps> = ({ error }: ErrorProps): React.ReactNode => {
  const t = useTranslations('common')
  const t_auth = useTranslations('auth')

  const router = useRouter()

  return (
    <div className='w-full h-screen flex items-center justify-center'>
      <div className='text-center flex flex-col gap-4 items-center justify-center'>
        <h1 className='text-lg font-medium'>
          {error.message === 'unauthorized' ? t('unauthorized') : t('error')}
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
            <Button>{t('go-to-home')}</Button>
          </Link>

          <Button
            color='secondary'
            onClick={async () => {
              await SessionAPIManager.delete()

              toast(t('success'))

              router.refresh()
            }}
          >
            {t_auth('logout')}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Error
