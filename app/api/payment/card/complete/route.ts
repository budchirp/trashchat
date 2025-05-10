import { NextResponse, type NextRequest } from 'next/server'
import { generateIyzicoHeaders } from '../init/util'
import { prisma } from '@/lib/prisma'
import { CONSTANTS } from '@/lib/constants'
import { Fetch } from '@/lib/fetch'

// TODO: DEAL WITH GARBAGE IYZICO API

export const POST = async (request: NextRequest) => {
  try {
    const { status, paymentId, conversationData, conversationId, mdStatus } = await request.json()

    if (status !== 'success') {
      throw new Error('Payment failed')
    }

    if (mdStatus !== '1') {
      throw new Error('Payment failed')
    }

    const iyzicoRequest = {
      locale: 'en',
      conversationId,
      paymentId,
      conversationData
    }

    const response = await Fetch.post<{
      status: string
      message: string
    }>(
      'https://sandbox-api.iyzipay.com/payment/3dsecure/auth',
      {
        body: iyzicoRequest
      },
      generateIyzicoHeaders('/payment/3dsecure/auth', iyzicoRequest)
    )

    const json = await response.json()
    if (json.status !== 'success') {
      throw new Error(json.message)
    }

    await prisma.user.update({
      where: {
        id: conversationId
      },
      data: {
        isPlus: true,

        credits: CONSTANTS.USAGES.PLUS.CREDITS,
        premiumCredits: CONSTANTS.USAGES.PLUS.PREMIUM_CREDITS
      }
    })

    return NextResponse.json({
      message: 'Success',
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
