import { NextResponse, type NextRequest } from 'next/server'
import { getTranslations } from 'next-intl/server'
import { authenticate } from '@/lib/auth/server'

export const POST = async (request: NextRequest) => {
  try {
    const locale = request.headers.get('accept-language') || 'en'
    const t = await getTranslations({ locale })

    const [isTokenValid, _, __, exists] = await authenticate(request.headers, request.cookies)
    if (!exists) {
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

    if (exists && !isTokenValid) {
      return NextResponse.json(
        {
          message: t('api.session-expired'),
          data: {}
        },
        {
          status: 403
        }
      )
    }

    if (!isTokenValid) {
      return NextResponse.json(
        {
          message: t('api.user.not-found'),
          data: {}
        },
        {
          status: 403
        }
      )
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
