import { Env } from '@/lib/env'
import { Fetch } from '@/lib/fetch'
import { NextResponse, type NextRequest } from 'next/server'

export const POST = async (request: NextRequest) => {
  try {
    const { captcha } = await request.json()
    if (!captcha) {
      throw new Error('captcha required')
    }

    const response = await Fetch.post<{
      success: boolean
    }>(
      `https://www.google.com/recaptcha/api/siteverify?secret=${Env.captchaSecretKey}&response=${captcha}`
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
