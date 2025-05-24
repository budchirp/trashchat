import { NextResponse, type NextRequest } from 'next/server'
import { Secrets } from '@/lib/secrets'
import { Fetch } from '@/lib/fetch'
import { authenticate } from '@/lib/auth/server'
import { getTranslations } from 'next-intl/server'
import { CONSTANTS } from '@/lib/constants'

export const POST = async (request: NextRequest) => {
  try {
    const locale = request.headers.get('accept-language') || 'en'
    const t = await getTranslations({ locale })

    const [response, user] = await authenticate(request, locale)
    if (response) return response

    const coinbaseApiKey = Secrets.coinbaseApiKey
    if (!coinbaseApiKey) {
      throw new Error(t('api.env-error', { env: 'COINBASE_API_KEY' }))
    }

    const coinbase_response = await Fetch.post<any>(
      'https://api.commerce.coinbase.com/charges/',
      {
        name: 'Trash Chat Subscription',
        description: 'Trash Chat Subscription',
        local_price: {
          amount: CONSTANTS.PLUS_PRICE.toString(),
          currency: 'USD'
        },
        pricing_type: 'fixed_price',
        metadata: {
          user_id: `${user.id}`
        }
      },
      {
        'X-CC-Api-Key': coinbaseApiKey,
        'X-CC-Version': '2018-03-22'
      }
    )

    const json = await coinbase_response.json()
    return NextResponse.json({
      message: t('common.success'),
      data: json.data
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
