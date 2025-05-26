'use client'

import type React from 'react'
import { useState } from 'react'

import { deleteAccountValidator } from '@/lib/validators/delete-account'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { AreYouSureDialog } from '@/components/r-u-sure'
import { useLocale, useTranslations } from 'next-intl'
import { CookieMonster } from '@/lib/cookie-monster'
import { UserAPIManager } from '@/lib/api/user'
import { CONSTANTS } from '@/lib/constants'
import { Input } from '@/components/input'
import { toast } from '@/components/toast'
import { Box } from '@/components/box'
import { Lock } from 'lucide-react'
import { useFormik } from 'formik'

type DeleteAccountDialogProps = {
  open: boolean
  onClose: () => void
}

export const DeleteAccountDialog: React.FC<DeleteAccountDialogProps> = ({
  open,
  onClose
}: DeleteAccountDialogProps): React.ReactNode => {
  const [error, setError] = useState<string | null>(null)

  const locale = useLocale()
  const t = useTranslations()

  const cookieMonster = new CookieMonster()

  const formik = useFormik({
    initialValues: {
      password: ''
    },
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true)

      const token = cookieMonster.get(CONSTANTS.COOKIES.TOKEN_NAME)
      if (token) {
        toast(t('common.loading'))

        const [verifyOk, verifyMessage, verificationToken] = await UserAPIManager.verifyPassword(
          { token, locale },
          values.password
        )

        if (verifyOk) {
          const [ok, message] = await UserAPIManager.delete({ token, locale }, verificationToken)
          if (ok) {
            toast(t('common.success'))

            onClose()

            window?.location?.replace(`/${locale}`)
          } else {
            setError(message || t('errors.error'))
          }
        } else {
          setError(verifyMessage || t('errors.error'))
        }

        setSubmitting(false)
      }
    },
    validationSchema: toFormikValidationSchema(deleteAccountValidator)
  })

  return (
    <AreYouSureDialog
      open={open}
      onClose={onClose}
      onSubmit={formik.handleSubmit}
      title={t('settings.account.delete')}
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
              id='password'
              name='password'
              type='password'
              autoComplete='name'
              icon={<Lock size={16} />}
              placeholder={t('auth.password')}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            {formik.errors.password && formik.touched.password && (
              <p className='text-red-500 ms-2'>{formik.errors.password}</p>
            )}
          </div>
        </div>
      </form>
    </AreYouSureDialog>
  )
}
