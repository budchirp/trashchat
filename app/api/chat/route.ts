import { NextResponse, type NextRequest } from 'next/server'
import { authenticate } from '@/lib/auth/server'
import { CONSTANTS } from '@/lib/constants'
import { prisma } from '@/lib/prisma'
import { getTranslations } from 'next-intl/server'

export const POST = async (request: NextRequest) => {
  try {
    const locale = request.headers.get('accept-language') || 'en'
    const t = await getTranslations({ locale })

    const [response, user] = await authenticate(request, locale)
    if (response) return response

    const chats = await prisma.chat.findMany({
      take: 1,
      orderBy: {
        updatedAt: 'desc'
      },
      include: {
        messages: {
          include: {
            files: true
          }
        }
      },
      where: {
        userId: user.id
      }
    })

    let chat: any = chats.length > 0 ? chats[0] : null
    if (!chat || (chat && chat.messages.length > 1)) {
      chat = await prisma.chat.create({
        data: {
          title: t('chat.new-chat'),

          model: user.customization.defaultModel || CONSTANTS.AI.DEFAULT_MODEL,

          userId: user.id
        }
      })
    }

    return NextResponse.json({
      message: t('common.success'),
      data: chat
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

export const GET = async (request: NextRequest) => {
  try {
    const locale = request.headers.get('accept-language') || 'en'
    const t = await getTranslations({ locale })

    const [response, user] = await authenticate(request, locale)
    if (response) return response

    const chats = await prisma.chat.findMany({
      where: {
        userId: user.id
      }
    })

    return NextResponse.json({
      message: t('common.success'),
      data: chats
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
