import { NextResponse, type NextRequest } from 'next/server'
import { authenticate } from '@/lib/auth/server'
import { Encrypt } from '@/lib/encrypt'
import { prisma } from '@/lib/prisma'

import type { User } from '@/types/user'
import { getTranslations } from 'next-intl/server'

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

    return NextResponse.json(
      {
        message: t('common.success'),
        data: {
          ...user,
          password: undefined,
          verificationToken: undefined
        }
      },
      {
        status: 201
      }
    )
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

export const DELETE = async (request: NextRequest) => {
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

    await prisma.user.delete({ where: user })

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
        name,
        email,
        password: await Encrypt.encrypt(password)
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

    const { name, email, profilePicture, systemPrompt, shareInfoWithAI } =
      (await request.json()) as User

    await prisma.user.update({
      where: {
        email,
        id: user.id
      },
      data: {
        name,
        email,
        profilePicture,
        systemPrompt,
        shareInfoWithAI
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
