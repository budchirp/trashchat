'use client'

import type React from 'react'

import { Button } from '@/components/button'
import { useTranslations } from 'next-intl'
import { Fetch } from '@/lib/fetch'
import { CookieMonster } from '@/lib/cookie-monster'
import { toast } from '@/components/toast'

import type { APIResponse } from '@/types/api'

export const SubscribePageClient: React.FC = (): React.ReactNode => {
  const t = useTranslations()

  const cookieMonster = new CookieMonster()

  const handlePay = async () => {
    toast(t('common.wait'))

    const token = cookieMonster.get('token')
    if (token) {
      const response = await Fetch.post<
        APIResponse<{
          hosted_url: string
        }>
      >(
        '/api/payment',
        {},
        {
          Authorization: `Bearer ${token}`
        }
      )

      const json = await response.json()
      if (response.ok) {
        window.location.href = json.data.hosted_url
      } else {
        toast(json.message || t('errors.error'))
      }
    }
  }

  return (
    <div className='flex justify-center w-full'>
      <Button onClick={handlePay}>{t('subscribe.pay')}</Button>
    </div>
  )
}
