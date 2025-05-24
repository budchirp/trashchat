'use client'

import type React from 'react'
import { useEffect, useState } from 'react'

import { useLogout } from '@/lib/helpers/use-logout'
import { CookieMonster } from '@/lib/cookie-monster'
import { CONSTANTS } from '@/lib/constants'
import { Button } from '@/components/button'
import { useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n/routing'

import type { ErrorProps } from '@/types/error'

const ErrorPage: React.FC<ErrorProps> = ({ error }: ErrorProps): React.ReactNode => {
  const t = useTranslations()

  const cookieMonster = new CookieMonster()

  const [token, setToken] = useState<string | null>(null)
  useEffect(() => {
    const token = cookieMonster.get(CONSTANTS.COOKIES.TOKEN_NAME)
    if (token) {
      setToken(token)
    }
  }, [])

  const logout = useLogout()

  return (
    <div className='w-full min-h-screen flex items-center py-4 justify-center'>
      <div className='text-center flex flex-col gap-4 items-center justify-center'>
        <h1 className='text-lg font-medium'>{error.message}</h1>

        {process.env.NODE_ENV === 'development' && <p>{error instanceof Error && error.stack}</p>}

        <div className='flex flex-col items-center gap-2'>
          <div>
            <Link href='/'>
              <Button>{t('common.go-to-home')}</Button>
            </Link>
          </div>

          <div>
            <Button
              color='secondary'
              onClick={() => {
                window?.location?.reload()
              }}
            >
              {t('common.refresh')}
            </Button>
          </div>

          <div>
            <Button
              color='secondary'
              onClick={() => {
                if (token) {
                  logout(token)
                }
              }}
            >
              {t('auth.logout')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ErrorPage
