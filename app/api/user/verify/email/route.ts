import { VerifyEmailTemplate } from '@/components/email/verify'
import { NextResponse, type NextRequest } from 'next/server'
import { authenticate } from '@/lib/auth/server'
import { CONSTANTS } from '@/lib/constants'
import { Secrets } from '@/lib/secrets'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

const resend = new Resend(Secrets.resendApiKey!)

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

    const { token } = await request.json()
    if (!token) {
      throw new Error('`token` field is required')
    }

    if (user.verificationToken !== token) {
      throw new Error('Invalid verification token')
    }

    await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        verified: true,

        credits: CONSTANTS.USAGES[user.plus ? 'PLUS' : 'NORMAL'].CREDITS,
        premiumCredits: CONSTANTS.USAGES[user.plus ? 'PLUS' : 'NORMAL'].PREMIUM_CREDITS
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

export const GET = async (request: NextRequest) => {
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

    if (
      user.lastEmailSent &&
      new Date(user.lastEmailSent).getTime() > Date.now() - 1000 * 60 * 60 * 1
    ) {
      throw new Error('Email already sent. Please wait 1 hour before requesting another.')
    }

    const { error } = await resend.emails.send({
      from: 'Trash Chat <verify@mail.trashchat.live>',
      to: user.email,
      subject: 'Verify email',
      react: VerifyEmailTemplate({
        token: user.verificationToken
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
        lastEmailSent: new Date()
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
