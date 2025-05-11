'use client'

import type React from 'react'
import { use, useEffect, useState } from 'react'

import { initializePaddle, type Paddle } from '@paddle/paddle-js'
import { UserContext } from '@/providers/context/user'
import { useLocale } from 'next-intl'
import { useTheme } from 'next-themes'

export const CheckoutForm: React.FC = (): React.ReactNode => {
  const { user } = use(UserContext)

  const { theme } = useTheme()
  const locale = useLocale()

  const [paddle, setPaddle] = useState<Paddle | null>(null)
  useEffect(() => {
    if (!paddle?.Initialized) {
      initializePaddle({
        token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || '',
        environment: 'sandbox',
        checkout: {
          settings: {
            variant: 'one-page',
            displayMode: 'inline',
            theme: theme as any,
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
  }, [paddle?.Initialized])

  return (
    <div className='w-full bg-background-primary rounded-2xl p-4'>
      <div className='paddle-checkout-frame' />
    </div>
  )
}
