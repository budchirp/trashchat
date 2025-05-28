'use client'

import type React from 'react'
import { useState } from 'react'

import { resetPasswordSendMailValidator } from '@/lib/validators/reset-password'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { useLocale, useTranslations } from 'next-intl'
import { UserAPIManager } from '@/lib/api/user'
import { useRouter } from '@/lib/i18n/routing'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { toast } from '@/components/toast'
import { Field } from '@headlessui/react'
import { Box } from '@/components/box'
import { Mail } from 'lucide-react'
import { useFormik } from 'formik'

export const ResetPasswordSendMailClientPage: React.FC = (): React.ReactNode => {
  const router = useRouter()

  const t = useTranslations()
  const locale = useLocale()

  const [error, setError] = useState<string | null>(null)
  const formik = useFormik({
    initialValues: {
      email: ''
    },
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true)

      const [ok, message] = await UserAPIManager.sendResetPasswordEmail({ locale }, values.email)
      if (ok) {
        toast(t('auth.email-sent'))

        router.push('/')
      } else {
        setError(message || t('errors.error'))
      }

      setSubmitting(false)
    },
    validationSchema: toFormikValidationSchema(resetPasswordSendMailValidator)
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
            id='email'
            name='email'
            type='email'
            autoComplete='email'
            icon={<Mail size={16} />}
            placeholder={t('auth.email')}
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          {formik.errors.email && formik.touched.email && (
            <p className='text-red-500 ms-2'>{formik.errors.email}</p>
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
