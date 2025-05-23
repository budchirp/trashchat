'use client'

import type React from 'react'

import { useLogout } from '@/lib/helpers/use-logout'
import { Button } from '@/components/button'
import { useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n/routing'

import type { ErrorProps } from '@/types/error'
import { CookieMonster } from '@/lib/cookie-monster'
import { CONSTANTS } from '@/lib/constants'

const Error: React.FC<ErrorProps> = ({ error }: ErrorProps): React.ReactNode => {
  const t = useTranslations()

  const cookieMonster = new CookieMonster()

  const logout = useLogout()

  return (
    <div className='w-full min-h-screen flex items-center py-4 justify-center'>
      <div className='text-center flex flex-col gap-4 items-center justify-center'>
        <h1 className='text-lg font-medium'>{error.message}</h1>

        <div className='grid gap-2'>
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

          {logout && (
            <Button
              color='secondary'
              onClick={() => {
                const token = cookieMonster.get(CONSTANTS.COOKIES.TOKEN_NAME)
                if (token) {
                  logout(token)
                }
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
