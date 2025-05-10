import { NextResponse, type NextRequest } from 'next/server'
import { Secrets } from '@/lib/secrets'
import { createHmac } from 'crypto'
import { prisma } from '@/lib/prisma'
import { CONSTANTS } from '@/lib/constants'

export const POST = async (request: NextRequest) => {
  try {
    const rawBody = await request.text()

    const signature = request.headers.get('X-IYZ-SIGNATURE-V3')
    if (!signature) {
      throw new Error('`X-IYZ-SIGNATURE-V3` header is required')
    }

    const iyzicoSecretKey = Secrets.iyzicoSecretKey
    if (!iyzicoSecretKey) {
      throw new Error('`IYZICO_SECRET_KEY` is not set')
    }

    const hmac = createHmac('sha256', iyzicoSecretKey)
    hmac.update(rawBody)
    const digest = hmac.digest('hex')

    if (digest !== signature) {
      throw new Error('Invalid signature')
    }

    const json = JSON.parse(rawBody)

    const {
      event: {
        type,
        data: {
          metadata: { id }
        }
      }
    } = json as {
      event: {
        type: 'charge:created' | 'charge:pending' | 'charge:confirmed' | 'charge:failed'
        data: {
          metadata: {
            id: string
          }
        }
      }
    }

    switch (type) {
      case 'charge:confirmed': {
        console.log('charge:confirmed', id)
        if (id) {
          await prisma.user.update({
            where: {
              id: Number(id)
            },
            data: {
              isPlus: true,

              credits: CONSTANTS.USAGES.PLUS.CREDITS,
              premiumCredits: CONSTANTS.USAGES.PLUS.PREMIUM_CREDITS
            }
          })
        }

        break
      }

      default: {
        console.log(type)
      }
    }

    return NextResponse.json({})
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
