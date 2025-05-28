'use client'

import type React from 'react'
import { useState } from 'react'

import { resetPasswordValidator } from '@/lib/validators/reset-password'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { useLocale, useTranslations } from 'next-intl'
import { UserAPIManager } from '@/lib/api/user'
import { useRouter } from '@/lib/i18n/routing'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { toast } from '@/components/toast'
import { Field } from '@headlessui/react'
import { Box } from '@/components/box'
import { Lock } from 'lucide-react'
import { useFormik } from 'formik'

type ResetPasswordClientPageProps = {
  verificationToken: string
}

export const ResetPasswordClientPage: React.FC<ResetPasswordClientPageProps> = ({
  verificationToken
}: ResetPasswordClientPageProps): React.ReactNode => {
  const router = useRouter()

  const t = useTranslations()
  const locale = useLocale()

  const [error, setError] = useState<string | null>(null)
  const formik = useFormik({
    initialValues: {
      password: ''
    },
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true)

      const [ok, message] = await UserAPIManager.resetPassword(
        { locale },
        verificationToken,
        values.password
      )
      if (ok) {
        toast(t('auth.reset-password.changed'))

        router.push('/auth/signin')
      } else {
        setError(message || t('errors.error'))
      }

      setSubmitting(false)
    },
    validationSchema: toFormikValidationSchema(resetPasswordValidator)
  })

  return (
    <form className='grid gap-2 max-w-96 w-full' onSubmit={formik.handleSubmit}>
      {error && (
        <Box variant='primary'>
          <p className='text-red-500'>{error}</p>
        </Box>
      )}

      <div className='grid gap-2 w-full'>
        <Field>
          <Input
            id='password'
            name='password'
            type='password'
            autoComplete='current-password'
            icon={<Lock size={16} />}
            placeholder={t('auth.password')}
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          {formik.errors.password && formik.touched.password && (
            <p className='text-red-500 ms-2'>{formik.errors.password}</p>
          )}
        </Field>
      </div>

      <div className='flex justify-end'>
        <Button loading={formik.isSubmitting} type='submit'>
          {t('common.submit')}
        </Button>
      </div>
    </form>
  )
}
