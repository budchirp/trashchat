import { NextResponse, type NextRequest } from 'next/server'
import { getTranslations } from 'next-intl/server'
import { authenticate } from '@/lib/auth/server'
import { CONSTANTS } from '@/lib/constants'
import { prisma } from '@/lib/prisma'

export const POST = async (request: NextRequest) => {
  try {
    const locale = request.headers.get('accept-language') || 'en'
    const t = await getTranslations({ locale })

    const [response, user] = await authenticate(request, locale)
    if (response) return response

    const { token } = await request.json()
    if (!token) {
      throw new Error(t('api.required-fields', { fields: 'token' }))
    }

    if (user.emailVerificationToken !== token) {
      throw new Error(t('api.invalid-verification-token'))
    }

    await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        isEmailVerified: true,

        usages: {
          update: {
            credits: CONSTANTS.USAGES[user.subscription ? 'PLUS' : 'NORMAL'].CREDITS,
            premiumCredits: CONSTANTS.USAGES[user.subscription ? 'PLUS' : 'NORMAL'].PREMIUM_CREDITS
          }
        }
      }
    })

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
