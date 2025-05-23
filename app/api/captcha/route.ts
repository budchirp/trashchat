import { NextResponse, type NextRequest } from 'next/server'
import { Secrets } from '@/lib/secrets'
import { Fetch } from '@/lib/fetch'
import { getTranslations } from 'next-intl/server'

export const POST = async (request: NextRequest) => {
  try {
    const locale = request.headers.get('accept-language') || 'en'
    const t = await getTranslations({ locale })

    const { captcha } = await request.json()
    if (!captcha) {
      throw new Error(t('api.required-fields', { fields: 'captcha' }))
    }

    const response = await Fetch.post<{
      success: boolean
    }>(
      `https://www.google.com/recaptcha/api/siteverify?secret=${Secrets.captchaSecretKey}&response=${captcha}`
    )
    const json = await response.json()

    return NextResponse.json({
      message: t('common.success'),
      data: {
        success: json.success
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
