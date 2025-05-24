import { NextResponse, type NextRequest } from 'next/server'
import { LogLevel, Paddle } from '@paddle/paddle-node-sdk'
import { EventName } from '@paddle/paddle-node-sdk'
import { getTranslations } from 'next-intl/server'
import { CONSTANTS } from '@/lib/constants'
import { Secrets } from '@/lib/secrets'
import { prisma } from '@/lib/prisma'

const paddleApiKey = Secrets.paddleApiKey
if (!paddleApiKey) {
  throw new Error('Paddle API key is not set')
}

const paddleWebhookSecret = Secrets.paddleWebhookSecret
if (!paddleWebhookSecret) {
  throw new Error('Paddle webhook secret is not set')
}

const paddle = new Paddle(paddleApiKey, {
  environment: process.env.NEXT_PUBLIC_PADDLE_ENV as any,
  logLevel: LogLevel.error
})

export const POST = async (request: NextRequest) => {
  try {
    const rawBody = await request.text()

    const locale = request.headers.get('accept-language') || 'en'
    const t = await getTranslations({ locale })

    const signature = request.headers.get('paddle-signature')
    if (!signature) {
      throw new Error(t('api.required-header', { header: 'paddle-signature' }))
    }

    const json = await paddle.webhooks.unmarshal(rawBody, paddleWebhookSecret, signature)
    if (!json) {
      throw new Error(t('api.invalid-signature'))
    }

    switch (json.eventType) {
      case EventName.TransactionCompleted: {
        const id = (json as any)?.data?.customData?.user_id || null
        if (id) {
          await prisma.user.update({
            where: {
              id: Number(id)
            },
            data: {
              firstUsageAt: new Date(Date.now()),

              subscription: {
                create: {
                  paymentMethod: 'card',

                  expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                }
              },

              usages: {
                update: {
                  credits: CONSTANTS.USAGES.PLUS.CREDITS,
                  premiumCredits: CONSTANTS.USAGES.PLUS.PREMIUM_CREDITS
                }
              }
            }
          })
        }

        break
      }

      default: {
        console.log(json.eventType)
      }
    }

    return NextResponse.json({
      message: t('common.success'),
      data: {}
    })
  } catch (error) {
    console.log(error)

    return NextResponse.json(
      {
        message: (error as Error).message,
        data: {}
      },
      { status: 500 }
    )
  }
}
