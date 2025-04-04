'use client'

import { Box } from '@/components/box'
import { Button } from '@/components/button'
import { Dialog } from '@/components/dialog'
import { Input } from '@/components/input'
import { CONSTANTS } from '@/lib/constants'
import { CookieMonster } from '@/lib/cookie-monster'
import { Fetch } from '@/lib/fetch'
import { useRouter } from '@/lib/i18n/routing'
import { toast } from '@/lib/toast'
import { deleteAccountValidator } from '@/lib/validators/delete-account'
import { useFormik } from 'formik'
import { Lock } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type React from 'react'
import { useState } from 'react'
import { toFormikValidationSchema } from 'zod-formik-adapter'

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
        const verify_response = await Fetch.post<{
          message: string
        }>('/api/user/verify', values, {
          Authorization: `Bearer ${token}`
        })

        const verify_json = await verify_response.json()
        if (verify_response.status < 400) {
          setError(null)

          const response = await Fetch.delete<{
            message: string
          }>('/api/user', {
            Authorization: `Bearer ${token}`
          })

          const json = await response.json()
          if (response.status < 400) {
            setError(null)

            cookieMonster.delete(CONSTANTS.COOKIES.TOKEN_NAME)

            toast(t_common('success'))

            onClose()

            router.push('/')
          } else {
            setError(json?.message || t_common('error'))
          }
        } else {
          setError(verify_json?.message || t_common('error'))
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
