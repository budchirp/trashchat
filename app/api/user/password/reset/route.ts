import { NextResponse, type NextRequest } from 'next/server'
import { getTranslations } from 'next-intl/server'
import { CONSTANTS } from '@/lib/constants'
import { Encrypt } from '@/lib/encrypt'
import { prisma } from '@/lib/prisma'

export const POST = async (request: NextRequest) => {
  try {
    const locale = request.headers.get('accept-language') || 'en'
    const t = await getTranslations({ locale })

    const { token, password } = await request.json()
    if (!token || !password) {
      throw new Error(t('api.required-fields', { fields: 'token, password' }))
    }

    const passwordReset = await prisma.passwordReset.findUnique({
      where: {
        id: token,

        expiresAt: {
          gt: new Date()
        }
      },
      include: {
        user: {
          include: {
            subscription: true
          }
        }
      }
    })

    if (!passwordReset) {
      throw new Error(t('api.invalid-verification-token'))
    }

    await prisma.user.update({
      where: {
        id: passwordReset.user.id
      },
      data: {
        password: await Encrypt.encrypt(password),

        isEmailVerified: true,

        usages: {
          update: !passwordReset.user.isEmailVerified
            ? {
                credits:
                  CONSTANTS.USAGES[passwordReset.user.subscription ? 'PLUS' : 'NORMAL'].CREDITS,
                premiumCredits:
                  CONSTANTS.USAGES[passwordReset.user.subscription ? 'PLUS' : 'NORMAL']
                    .PREMIUM_CREDITS
              }
            : undefined
        },

        passwordResets: {
          delete: {
            id: token
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
