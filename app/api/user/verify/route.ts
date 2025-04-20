import { NextResponse, type NextRequest } from 'next/server'
import { authenticate } from '@/lib/auth/server/authenticate'
import { Encrypt } from '@/lib/encrypt'

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

    const { password } = await request.json()
    if (!password) {
      throw new Error('Password is null!')
    }

    const passwordMatch = await Encrypt.compare(password, user.password)
    if (!passwordMatch) {
      throw new Error('Invalid password!')
    }

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
