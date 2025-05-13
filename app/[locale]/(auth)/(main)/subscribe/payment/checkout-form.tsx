'use client'

import type React from 'react'
import { use, useEffect, useState } from 'react'

import { initializePaddle, type Paddle } from '@paddle/paddle-js'
import { UserContext } from '@/providers/context/user'
import { useLocale, useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'
import { Box } from '@/components/box'

export const CheckoutForm: React.FC = (): React.ReactNode => {
  const t = useTranslations('common')

  const { user } = use(UserContext)

  const { theme } = useTheme()
  const locale = useLocale()

  const [mounted, setMounted] = useState<boolean>(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const [paddle, setPaddle] = useState<Paddle | null>(null)
  useEffect(() => {
    if (mounted && !paddle?.Initialized) {
      initializePaddle({
        token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || '',
        environment: 'sandbox',
        checkout: {
          settings: {
            variant: 'one-page',
            displayMode: 'inline',
            theme: theme === 'dark' ? 'dark' : theme === 'light' ? 'light' : 'dark',
            allowLogout: false,
            locale,
            frameTarget: 'paddle-checkout-frame',
            frameInitialHeight: 500,
            frameStyle: 'width: 100%; background-color: transparent; border: none',
            successUrl: `${locale}/subscribe/payment/success`
          }
        }
      }).then((paddle) => {
        if (paddle) {
          setPaddle(paddle)

          paddle.Checkout.open({
            customer: {
              email: user.email
            },
            customData: {
              user_id: user.id
            },
            items: [
              {
                priceId: 'pri_01jtzcsjyzz4cpsrn04e1apcg3',
                quantity: 1
              }
            ]
          })
        }
      })
    }
  }, [mounted, paddle?.Initialized])

  return (
    <Box variant='primary' padding='small'>
      {(!paddle || !paddle?.Initialized) && <h2 className='font-medium'>{t('loading')}</h2>}

      <div className='paddle-checkout-frame' />
    </Box>
  )
}
