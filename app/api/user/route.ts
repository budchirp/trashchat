import { NextResponse, type NextRequest } from 'next/server'
import { getTranslations } from 'next-intl/server'
import { authenticate, verifyToken } from '@/lib/auth/server'
import { CONSTANTS } from '@/lib/constants'
import { Secrets } from '@/lib/secrets'
import { Encrypt } from '@/lib/encrypt'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

import type { JWTPayloadWithVerificationToken } from '@/types/jwt'
import type { User } from '@/types/user'

export const GET = async (request: NextRequest) => {
  try {
    const locale = request.headers.get('accept-language') || 'en'
    const t = await getTranslations({ locale })

    const [response, user] = await authenticate(request, locale)
    if (response) return response

    return NextResponse.json(
      {
        message: t('common.success'),
        data: {
          ...user,
          emailVerificationToken: undefined,
          password: undefined
        } as Partial<User>
      },
      {
        status: 201
      }
    )
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

export const DELETE = async (request: NextRequest) => {
  try {
    const locale = request.headers.get('accept-language') || 'en'
    const t = await getTranslations({ locale })

    const [response, user] = await authenticate(request, locale)
    if (response) return response

    const verificationToken = request.nextUrl.searchParams.get('verificationToken')
    if (!verificationToken) {
      throw new Error(t('api.required-fields', { fields: 'verificationToken' }))
    }

    try {
      jwt.verify(verificationToken, Secrets.appSecret) as JWTPayloadWithVerificationToken
    } catch (error) {
      throw new Error(t('api.invalid-verification-token'))
    }

    await prisma.user.delete({
      where: {
        id: user.id
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

export const POST = async (request: NextRequest) => {
  try {
    const locale = request.headers.get('accept-language') || 'en'
    const t = await getTranslations({ locale })

    const { name, email, password } = await request.json()
    if (!name || !email || !password) {
      throw new Error(t('api.required-fields', { fields: 'name, email, password' }))
    }

    const user = await prisma.user.findUnique({
      where: {
        email
      }
    })

    if (user) {
      throw new Error(t('api.user.already-exists'))
    }

    await prisma.user.create({
      data: {
        email,
        password: await Encrypt.encrypt(password),

        profile: {
          create: {
            name
          }
        },

        customization: {
          create: {
            defaultModel: CONSTANTS.AI.DEFAULT_MODEL
          }
        },

        usages: {
          create: {}
        }
      }
    })

    return NextResponse.json(
      {
        message: t('common.success'),
        data: {}
      },
      {
        status: 201
      }
    )
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

export const PATCH = async (request: NextRequest) => {
  try {
    const locale = request.headers.get('accept-language') || 'en'
    const t = await getTranslations({ locale })

    const [response, user] = await authenticate(request, locale)
    if (response) return response

    const { name, email, profilePicture, defaultModel, systemPrompt, shareInfoWithAI } =
      await request.json()

    await prisma.user.update({
      where: {
        email,
        id: user.id
      },
      data: {
        profile: {
          update: {
            name,
            profilePicture
          }
        },
        customization: {
          update: {
            defaultModel,
            systemPrompt,
            shareInfoWithAI
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
