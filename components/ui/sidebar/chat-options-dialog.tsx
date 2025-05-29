'use client'

import type React from 'react'
import { useState } from 'react'

import { chatOptionsValidator } from '@/lib/validators/chat-options'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { AreYouSureDialog } from '@/components/r-u-sure'
import { useLocale, useTranslations } from 'next-intl'
import { CookieMonster } from '@/lib/cookie-monster'
import { Label, Field } from '@headlessui/react'
import { Checkbox } from '@/components/checkbox'
import { ChatAPIManager } from '@/lib/api/chat'
import { CONSTANTS } from '@/lib/constants'
import { toast } from '@/components/toast'
import { Input } from '@/components/input'
import { Box } from '@/components/box'
import { Heading } from 'lucide-react'
import { useFormik } from 'formik'

import type { Chat } from '@/types/chat'

type ChatOptionsDialogProps = {
  chat: Chat

  onUpdate: () => void

  open: boolean
  onClose: () => void
}

export const ChatOptionsDialog: React.FC<ChatOptionsDialogProps> = ({
  chat,

  onUpdate,

  open,
  onClose
}: ChatOptionsDialogProps): React.ReactNode => {
  const [error, setError] = useState<string | null>(null)

  const locale = useLocale()
  const t = useTranslations()

  const cookieMonster = new CookieMonster()

  const formik = useFormik({
    initialValues: {
      title: chat.title,
      shared: chat.shared
    },
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true)

      const token = cookieMonster.get(CONSTANTS.COOKIES.TOKEN_NAME)
      if (token) {
        toast(t('common.loading'))

        try {
          const [ok, message] = await ChatAPIManager.update({ token, locale }, chat.id, values)
          if (ok) {
            toast(t('common.success'))

            onClose()
          } else {
            setError(message || t('errors.error'))
          }
        } catch {
        } finally {
          onUpdate()
        }
      }

      setSubmitting(false)
    },
    validationSchema: toFormikValidationSchema(chatOptionsValidator)
  })

  return (
    <AreYouSureDialog
      style='default'
      open={open}
      onClose={onClose}
      onSubmit={formik.handleSubmit}
      title={t('chat.options')}
    >
      <form className='grid gap-2' onSubmit={formik.handleSubmit}>
        {error && (
          <Box variant='primary'>
            <p className='text-red-500'>{error}</p>
          </Box>
        )}

        <div className='grid gap-2 w-full'>
          <div>
            <Input
              textarea
              id='title'
              name='title'
              type='text'
              autoComplete='title'
              icon={<Heading size={16} />}
              placeholder={t('chat.title')}
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            {formik.errors.title && formik.touched.title && (
              <p className='text-red-500 ms-2'>{formik.errors.title}</p>
            )}
          </div>

          <div>
            <Field className='flex items-center gap-2'>
              <Checkbox
                id='shared'
                name='shared'
                checked={formik.values.shared}
                onChange={(checked) => formik.setFieldValue('shared', checked)}
              />

              <Label htmlFor='shareInfoWithAI'>{t('chat.shared')}</Label>
            </Field>
          </div>
        </div>
      </form>
    </AreYouSureDialog>
  )
}
