import { NextResponse, type NextRequest } from 'next/server'
import { authenticate, verifyToken } from '@/lib/auth/server'
import { getTranslations } from 'next-intl/server'
import { CONSTANTS } from '@/lib/constants'
import { prisma } from '@/lib/prisma'

import type { Message, MessagePart } from '@prisma/client'
import { convertMessageToUIMessage } from '@/lib/ai/db-helper'

export const DELETE = async (
  request: NextRequest,
  {
    params
  }: {
    params: Promise<{
      id: string
    }>
  }
) => {
  try {
    const locale = request.headers.get('accept-language') || 'en'
    const t = await getTranslations({ locale })

    const [response, user] = await authenticate(request, locale)
    if (response) return response

    const { id } = await params

    await prisma.chat.delete({
      where: {
        id,

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

export const GET = async (
  request: NextRequest,
  {
    params
  }: {
    params: Promise<{
      id: string
    }>
  }
) => {
  try {
    const locale = request.headers.get('accept-language') || 'en'
    const t = await getTranslations({ locale })

    const [response, user] = await authenticate(request, locale)
    if (response) return response

    const { id } = await params
    if (id === '-1') {
      const chats = await prisma.chat.findMany({
        take: 1,
        orderBy: {
          updatedAt: 'desc'
        },
        include: {
          messages: {
            include: {
              files: true,
              parts: true
            }
          }
        },
        where: {
          userId: user.id
        }
      })

      const newChat = {
        title: t('chat.new-chat'),

        model: user.customization.defaultModel || CONSTANTS.AI.DEFAULT_MODEL,

        userId: user.id
      }

      let chat: any
      if (chats.length < 1) {
        chat = await prisma.chat.create({
          data: newChat,
          include: {
            messages: {
              include: {
                files: true
              }
            }
          }
        })
      } else {
        chat = chats[0]

        if (chat.messages.length > 2) {
          chat = await prisma.chat.create({
            data: newChat,
            include: {
              messages: {
                include: {
                  files: true
                }
              }
            }
          })
        }
      }

      return NextResponse.json({
        message: t('common.success'),
        data: {
          ...chat,
          messages: chat.messages.map(convertMessageToUIMessage)
        }
      })
    }

    const chat = await prisma.chat.findUnique({
      where: {
        id,

        userId: user.id
      },
      include: {
        messages: {
          include: {
            files: true,
            parts: true
          }
        }
      }
    })

    if (!chat) {
      throw new Error(t('chat.errors.not-found'))
    }

    return NextResponse.json({
      message: t('common.success'),
      data: {
        ...chat,
        messages: chat.messages.map(convertMessageToUIMessage)
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
