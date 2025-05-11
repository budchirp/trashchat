import { NextResponse, type NextRequest } from 'next/server'
import { Secrets } from '@/lib/secrets'
import { prisma } from '@/lib/prisma'
import { CONSTANTS } from '@/lib/constants'
import { getTranslations } from 'next-intl/server'
import { paddle } from '@/lib/payments/paddle'
import { EventName, type TransactionCompletedEvent } from '@paddle/paddle-node-sdk'

export const POST = async (request: NextRequest) => {
  try {
    const rawBody = await request.text()

    const locale = request.headers.get('accept-language') || 'en'
    const t = await getTranslations({ locale })

    const signature = request.headers.get('paddle-signature')
    if (!signature) {
      throw new Error(t('api.required-header', { header: 'paddle-signature' }))
    }

    const paddleWebhookSecret = Secrets.paddleWebhookSecret
    if (!paddleWebhookSecret) {
      throw new Error(t('api.env-error', { env: 'PADDLE_WEBHOOK_SECRET' }))
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
              isPlus: true,

              paymentMethod: 'card',

              credits: CONSTANTS.USAGES.PLUS.CREDITS,
              premiumCredits: CONSTANTS.USAGES.PLUS.PREMIUM_CREDITS
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
    return NextResponse.json(
      {
        message: (error as Error).message,
        data: {}
      },
      { status: 500 }
    )
  }
}
