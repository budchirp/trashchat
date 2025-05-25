import { NextResponse, type NextRequest } from 'next/server'
import { Secrets } from '@/lib/secrets'
import { createHmac } from 'crypto'
import { prisma } from '@/lib/prisma'
import { CONSTANTS } from '@/lib/constants'
import { getTranslations } from 'next-intl/server'

export const POST = async (request: NextRequest) => {
  try {
    const rawBody = await request.text()

    const locale = request.headers.get('accept-language') || 'en'
    const t = await getTranslations({ locale })

    const signature = request.headers.get('x-cc-webhook-signature')
    if (!signature) {
      throw new Error(t('api.required-header', { header: 'x-cc-webhook-signature' }))
    }

    const coinbaseWebhookSecret = Secrets.coinbaseWebhookSecret
    if (!coinbaseWebhookSecret) {
      throw new Error(t('api.env-error', { env: 'COINBASE_WEBHOOK_SECRET' }))
    }

    const hmac = createHmac('sha256', coinbaseWebhookSecret)
    hmac.update(rawBody)
    const digest = hmac.digest('hex')

    if (digest !== signature) {
      throw new Error(t('api.invalid-signature'))
    }

    const json = JSON.parse(rawBody)

    const {
      event: {
        type,
        data: {
          metadata: { user_id: id }
        }
      }
    } = json as {
      event: {
        type: 'charge:created' | 'charge:pending' | 'charge:confirmed' | 'charge:failed'
        data: {
          metadata: {
            user_id: string
          }
        }
      }
    }

    switch (type) {
      case 'charge:confirmed': {
        if (id) {
          await prisma.user.update({
            where: {
              id: Number(id)
            },
            data: {
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
        console.log(type)
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
