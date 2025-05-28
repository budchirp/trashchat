import { PasswordResetTemplate } from '@/components/email/password-reset'
import { NextResponse, type NextRequest } from 'next/server'
import { getTranslations } from 'next-intl/server'
import { Secrets } from '@/lib/secrets'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

const resendApiKey = Secrets.resendApiKey
if (!resendApiKey) {
  throw new Error('Resend API key is not set')
}

const resend = new Resend(resendApiKey)

export const POST = async (request: NextRequest) => {
  try {
    const locale = request.headers.get('accept-language') || 'en'
    const t = await getTranslations({ locale })

    const { email } = await request.json()
    if (!email) {
      throw new Error(t('api.required-fields', { fields: 'email' }))
    }

    const user = await prisma.user.findUnique({
      where: {
        email
      }
    })

    if (!user) {
      throw new Error(t('api.user.not-found'))
    }

    if (
      user.lastEmailSentAt &&
      new Date(user.lastEmailSentAt).getTime() > Date.now() - 1000 * 60 * 60 * 1
    ) {
      throw new Error(t('api.user.email-already-sent'))
    }

    const { id } = await prisma.passwordReset.create({
      data: {
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),

        userId: user.id
      }
    })

    const { error } = await resend.emails.send({
      from: 'Trash Chat <password-reset@mail.trashchat.live>',
      to: user.email,
      subject: 'Password reset',
      react: PasswordResetTemplate({
        token: id,
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
