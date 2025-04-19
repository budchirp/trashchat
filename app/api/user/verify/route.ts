import { NextResponse, type NextRequest } from 'next/server'
import { authenticate } from '@/lib/auth/server/authenticate'
import { Encrypt } from '@/lib/encrypt'
import { prisma } from '@/lib/prisma'

export const POST = async (request: NextRequest) => {
  try {
    const { password } = await request.json()
    if (!password) {
      throw new Error('Password is null!')
    }

    const [isTokenValid, payload] = await authenticate(request.headers)
    if (!isTokenValid || !payload) {
      throw new Error('Invalid token.')
    }

    const user = await prisma.user.findUnique({
      where: {
        id: payload.id
      }
    })

    if (!user) {
      throw new Error('User not found!')
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
