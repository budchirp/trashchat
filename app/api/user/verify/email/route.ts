import { VerifyEmailTemplate } from '@/components/email/verify'
import { NextResponse, type NextRequest } from 'next/server'
import { authenticate } from '@/lib/auth/server'
import { CONSTANTS } from '@/lib/constants'
import { Secrets } from '@/lib/secrets'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'
import { getTranslations } from 'next-intl/server'

const resend = new Resend(Secrets.resendApiKey!)

export const POST = async (request: NextRequest) => {
  try {
    const locale = request.headers.get('accept-language') || 'en'
    const t = await getTranslations({ locale })

    const [isTokenValid, payload, user] = await authenticate(request.headers)
    if (!isTokenValid || !payload) {
      return NextResponse.json(
        {
          message: t('errors.unauthorized'),
          data: {}
        },
        {
          status: 403
        }
      )
    }

    const { token } = await request.json()
    if (!token) {
      throw new Error(t('api.required-fields', { fields: 'token' }))
    }

    if (user.emailVerificationToken !== token) {
      throw new Error(t('api.user.invalid-verification-token'))
    }

    await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        isEmailVerified: true,

        credits: CONSTANTS.USAGES[user.isPlus ? 'PLUS' : 'NORMAL'].CREDITS,
        premiumCredits: CONSTANTS.USAGES[user.isPlus ? 'PLUS' : 'NORMAL'].PREMIUM_CREDITS
      }
    })

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

export const GET = async (request: NextRequest) => {
  try {
    const locale = request.headers.get('accept-language') || 'en'
    const t = await getTranslations({ locale })

    const [isTokenValid, payload, user] = await authenticate(request.headers)
    if (!isTokenValid || !payload) {
      return NextResponse.json(
        {
          message: t('errors.unauthorized'),
          data: {}
        },
        {
          status: 403
        }
      )
    }

    if (user.isEmailVerified) {
      return NextResponse.json({
        message: 'Success',
        data: {}
      })
    }

    if (
      user.lastEmailSentAt &&
      new Date(user.lastEmailSentAt).getTime() > Date.now() - 1000 * 60 * 60 * 1
    ) {
      throw new Error(t('api.user.email-already-sent'))
    }

    const { error } = await resend.emails.send({
      from: 'Trash Chat <verify@mail.trashchat.live>',
      to: user.email,
      subject: 'Verify email',
      react: VerifyEmailTemplate({
        token: user.emailVerificationToken,
        t
      }) as any
    })

    if (error) {
      throw new Error(error.message)
    }

    await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        lastEmailSentAt: new Date()
      }
    })

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
