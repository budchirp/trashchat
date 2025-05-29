import { VerifyEmailTemplate } from '@/components/email/verify'
import { NextResponse, type NextRequest } from 'next/server'
import { getTranslations } from 'next-intl/server'
import { authenticate } from '@/lib/auth/server'
import { prisma } from '@/lib/prisma'
import { resend } from '@/lib/resend'

export const POST = async (request: NextRequest) => {
  try {
    const locale = request.headers.get('accept-language') || 'en'
    const t = await getTranslations({ locale })

    const [response, user] = await authenticate(request, locale)
    if (response) return response

    if (user.isEmailVerified) {
      return NextResponse.json({
        message: t('common.success'),
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
      subject: t('email.verify.subject'),
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
