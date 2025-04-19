'use client'

import type React from 'react'
import { useState } from 'react'

import { deleteAccountValidator } from '@/lib/validators/delete-account'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { SessionAPIManager } from '@/lib/api/session'
import { CookieMonster } from '@/lib/cookie-monster'
import { Button } from '@/components/button'
import { Dialog } from '@/components/dialog'
import { Input } from '@/components/input'
import { CONSTANTS } from '@/lib/constants'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/lib/i18n/routing'
import { UserAPIManager } from '@/lib/api/user'
import { Box } from '@/components/box'
import { toast } from '@/lib/toast'
import { useFormik } from 'formik'
import { Lock } from 'lucide-react'

type AccountDeleteDialogProps = {
  open: boolean
  onClose: () => void
}

export const AccountDeleteDialog: React.FC<AccountDeleteDialogProps> = ({
  open,
  onClose
}: AccountDeleteDialogProps): React.ReactNode => {
  const [error, setError] = useState<string | null>(null)

  const t = useTranslations('account')
  const t_auth = useTranslations('auth')
  const t_common = useTranslations('common')

  const cookieMonster = new CookieMonster()

  const router = useRouter()

  const formik = useFormik({
    initialValues: {
      password: ''
    },
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true)

      const token = cookieMonster.get(CONSTANTS.COOKIES.TOKEN_NAME)
      if (token) {
        const [verify_success, verify_message] = await UserAPIManager.verify(token, values.password)
        if (verify_success) {
          const [success, message] = await UserAPIManager.delete(token)
          if (success) {
            await SessionAPIManager.delete()

            toast(t_common('success'))

            onClose()

            router.push('/')
          } else {
            setError(message || t_common('error'))
          }
        } else {
          setError(verify_message || t_common('error'))
        }

        setSubmitting(false)
      }
    },
    validationSchema: toFormikValidationSchema(deleteAccountValidator)
  })

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={t('delete')}
      content={
        <form className='grid  gap-2' onSubmit={formik.handleSubmit}>
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
                placeholder={t_auth('password')}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />

              {formik.errors.password && formik.touched.password && (
                <p className='text-red-500 ms-2'>{formik.errors.password}</p>
              )}
            </div>
          </div>

          <div>
            <Button loading={formik.isSubmitting} type='submit'>
              {t_common('submit')}
            </Button>
          </div>
        </form>
      }
    />
  )
}
