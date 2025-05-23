import { NextResponse, type NextRequest } from 'next/server'
import { authenticate } from '@/lib/auth/server'
import { Encrypt } from '@/lib/encrypt'
import { getTranslations } from 'next-intl/server'
import { prisma } from '@/lib/prisma'

export const POST = async (request: NextRequest) => {
  try {
    const locale = request.headers.get('accept-language') || 'en'
    const t = await getTranslations({ locale })

    const [isTokenValid, payload, user] = await authenticate(request.headers, request.cookies)
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

    const { password } = await request.json()
    if (!password) {
      throw new Error(t('api.required-fields', { fields: 'password' }))
    }

    const passwordMatch = await Encrypt.compare(password, user.password)
    if (!passwordMatch) {
      throw new Error(t('api.user.invalid-password'))
    }

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

export const PATCH = async (request: NextRequest) => {
  try {
    const locale = request.headers.get('accept-language') || 'en'
    const t = await getTranslations({ locale })

    const [isTokenValid, payload, user] = await authenticate(request.headers, request.cookies)
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

    const { password, newPassword } = await request.json()
    if (!password || !newPassword) {
      throw new Error(t('api.required-fields', { fields: 'password, newPassword' }))
    }

    const passwordMatch = await Encrypt.compare(password, user.password)
    if (!passwordMatch) {
      throw new Error(t('api.user.invalid-password'))
    }

    await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        password: await Encrypt.encrypt(newPassword)
      }
    })

    await prisma.session.deleteMany({
      where: {
        userId: user.id,

        NOT: {
          id: payload.token
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
