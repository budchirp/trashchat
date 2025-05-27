import { NextResponse, type NextRequest } from 'next/server'
import { getTranslations } from 'next-intl/server'
import { authenticate } from '@/lib/auth/server'
import { prisma } from '@/lib/prisma'

export const DELETE = async (
  request: NextRequest,
  {
    params
  }: {
    params: Promise<{
      chatId: string
      messageId: number
    }>
  }
) => {
  try {
    const locale = request.headers.get('accept-language') || 'en'
    const t = await getTranslations({ locale })

    const [response, user] = await authenticate(request, locale)
    if (response) return response

    const { chatId, messageId } = await params

    await prisma.message.delete({
      where: {
        id: Number(messageId),

        chatId,

        userId: user.id
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
