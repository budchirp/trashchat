import { NextResponse, type NextRequest } from 'next/server'
import { authenticate } from '@/lib/auth/server'
import { Encrypt } from '@/lib/encrypt'
import { getTranslations } from 'next-intl/server'
import { Secrets } from '@/lib/secrets'
import jwt from 'jsonwebtoken'

export const POST = async (request: NextRequest) => {
  try {
    const locale = request.headers.get('accept-language') || 'en'
    const t = await getTranslations({ locale })

    const [response, user] = await authenticate(request, locale)
    if (response) return response

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
      data: {
        verificationToken: jwt.sign({}, Secrets.appSecret, {
          expiresIn: '1h'
        })
      }
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
