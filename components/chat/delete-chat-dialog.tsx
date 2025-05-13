'use client'

import type React from 'react'

import { CookieMonster } from '@/lib/cookie-monster'
import { useRouter } from '@/lib/i18n/routing'
import { useLocale, useTranslations } from 'next-intl'
import { AreYouSureDialog } from '@/components/r-u-sure'
import { ChatAPIManager } from '@/lib/api/chat'
import { CONSTANTS } from '@/lib/constants'
import { toast } from '@/components/toast'

type DeleteChatDialogProps = {
  id: string
  redirect: boolean
  open: boolean
  onClose: () => void
  onDelete: () => void
}

export const DeleteChatDialog: React.FC<DeleteChatDialogProps> = ({
  id,
  redirect,
  open,
  onClose,
  onDelete
}: DeleteChatDialogProps): React.ReactNode => {
  const locale = useLocale()
  const t = useTranslations('chat')
  const t_common = useTranslations('common')

  const cookieMonster = new CookieMonster()

  const router = useRouter()
  return (
    <AreYouSureDialog
      open={open}
      onClose={onClose}
      onSubmit={async () => {
        const token = cookieMonster.get(CONSTANTS.COOKIES.TOKEN_NAME)
        if (token) {
          try {
            const ok = await ChatAPIManager.delete({ token, locale }, id)
            if (!ok) {
              toast(t_common('error'))
              return
            }

            if (redirect) {
              const chat = await ChatAPIManager.get({ token, locale }, '-1')

              if (chat) {
                router.push(`/chat/${chat.id}`)
              } else {
                router.push('/')
              }
            }
          } catch {
          } finally {
            onDelete()
          }
        }
      }}
      title={t('delete')}
    >
      <p>{t('are-you-sure')}</p>
    </AreYouSureDialog>
  )
}
