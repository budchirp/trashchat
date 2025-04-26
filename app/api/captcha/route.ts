import { NextResponse, type NextRequest } from 'next/server'
import { Secrets } from '@/lib/secrets'
import { Fetch } from '@/lib/fetch'

export const POST = async (request: NextRequest) => {
  try {
    const { captcha } = await request.json()
    if (!captcha) {
      throw new Error('`captcha` field is required')
    }

    const response = await Fetch.post<{
      success: boolean
    }>(
      `https://www.google.com/recaptcha/api/siteverify?secret=${Secrets.captchaSecretKey}&response=${captcha}`
    )
    const json = await response.json()

    return NextResponse.json({
      message: 'Success',
      data: {
        success: json.success
      }
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
