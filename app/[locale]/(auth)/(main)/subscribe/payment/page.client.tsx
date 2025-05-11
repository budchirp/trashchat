'use client'

import type React from 'react'

import { Button } from '@/components/button'
import { useLocale, useTranslations } from 'next-intl'
import { Fetch } from '@/lib/fetch'
import { CookieMonster } from '@/lib/cookie-monster'
import { Seperator } from '@/components/seperator'
import { CheckoutForm } from './checkout-form'
import { toast } from '@/components/toast'

import type { APIResponse } from '@/types/api'

export const PaymentPageClient: React.FC = (): React.ReactNode => {
  const locale = useLocale()
  const t = useTranslations()

  const cookieMonster = new CookieMonster()

  const payWithCrypto = async () => {
    toast(t('common.wait'))

    const token = cookieMonster.get('token')
    if (token) {
      const response = await Fetch.post<
        APIResponse<{
          hosted_url: string
        }>
      >(
        '/api/payment/crypto',
        {},
        {
          Authorization: `Bearer ${token}`,
          'accept-language': locale || 'en'
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
    <div className='max-w-96 w-full'>
      <div className='w-full flex items-center justify-center'>
        <Button onClick={payWithCrypto}>{t('subscribe.payment.pay-with-crypto')}</Button>
      </div>

      <Seperator text={t('common.or')} />

      <div className='w-full flex flex-col gap-4 items-center justify-center'>
        <h2 className='font-medium'>{t('subscribe.payment.pay-with-card')}</h2>

        <CheckoutForm />
      </div>
    </div>
  )
}
