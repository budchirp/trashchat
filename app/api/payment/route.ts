import { NextResponse, type NextRequest } from 'next/server'
import { Secrets } from '@/lib/secrets'
import { Fetch } from '@/lib/fetch'
import { authenticate } from '@/lib/auth/server'

export const POST = async (request: NextRequest) => {
  try {
    const [isTokenValid, payload, user] = await authenticate(request.headers)
    if (!isTokenValid || !payload) {
      return NextResponse.json(
        {
          message: 'Unauthorized',
          data: {}
        },
        {
          status: 403
        }
      )
    }

    const coinbaseApiKey = Secrets.coinbaseApiKey
    if (!coinbaseApiKey) {
      throw new Error('`COINBASE_API_KEY` is not set')
    }

    const response = await Fetch.post<any>(
      'https://api.commerce.coinbase.com/charges/',
      {
        name: 'Trash Chat Subscription',
        description: 'Trash Chat Subscription',
        local_price: {
          amount: '0.01',
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

    const json = await response.json()

    return NextResponse.json({
      message: 'Success',
      data: json.data
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
