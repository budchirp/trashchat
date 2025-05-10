import { NextResponse, type NextRequest } from 'next/server'
import { authenticate } from '@/lib/auth/server'
import { generateIyzicoHeaders } from './util'
import { CONSTANTS } from '@/lib/constants'
import { Fetch } from '@/lib/fetch'
import { Env } from '@/lib/env'

// TODO: DEAL WITH GARBAGE IYZICO API

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

    const { name, card, expiry, cvc, phone, address, city, zip, country } = await request.json()

    const iyzicoAddress = {
      contactName: name,
      address,
      city,
      country,
      zipCode: zip
    }

    const price = String(CONSTANTS.PLUS_PRICE)
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || ''

    const iyzicoRequest = {
      locale: 'en',
      conversationId: user.id.toString(),
      paymentChannel: 'WEB',
      paymentGroup: 'PRODUCT',
      price,
      paidPrice: price,
      currency: 'USD',
      installment: 1,
      paymentCard: {
        cardHolderName: name,
        cardNumber: card,
        expireYear: expiry.split('/')[1]!,
        expireMonth: expiry.split('/')[0]!,
        cvc: cvc
      },
      billingAddress: iyzicoAddress,
      shippingAddress: iyzicoAddress,
      callbackUrl: `${Env.appUrl}/api/payment/card/callback`,
      buyer: {
        id: user.id.toString(),
        name: name.split(' ')[0],
        surname: name.split(' ')[1],
        email: user.email,
        gsmNumber: phone,
        identityNumber: '11111111111',
        ip,
        registrationAddress: iyzicoAddress.address,
        ...iyzicoAddress
      },
      basketItems: [
        {
          id: '0',
          name: `${Env.appName} plus`,
          category1: 'Subscription',
          category2: 'Technology',
          price,
          itemType: 'VIRTUAL'
        }
      ]
    }

    const response = await Fetch.post<{
      status: string
      message: string
      threeDSHtmlContent: string
      paymentId: string
    }>(
      'https://sandbox-api.iyzipay.com/payment/3dsecure/initialize',
      {
        body: iyzicoRequest
      },
      generateIyzicoHeaders('/payment/3dsecure/initialize', iyzicoRequest)
    )

    const json = await response.json()
    console.log(json)
    if (json.status !== 'success') {
      throw new Error(json.message)
    }

    return NextResponse.json({
      message: 'Success',
      data: {
        threeDSHtmlContent: json.threeDSHtmlContent,
        paymentId: json.paymentId
      }
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
