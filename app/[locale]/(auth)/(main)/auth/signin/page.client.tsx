'use client'

import type React from 'react'
import { use, useState } from 'react'

import { toFormikValidationSchema } from 'zod-formik-adapter'
import { signInValidator } from '@/lib/validators/signin'
import { UserContext } from '@/providers/context/user'
import { useLocale, useTranslations } from 'next-intl'
import { SessionAPIManager } from '@/lib/api/session'
import { UserAPIManager } from '@/lib/api/user'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { toast } from '@/components/toast'
import { Field } from '@headlessui/react'
import { Lock, Mail } from 'lucide-react'
import { Box } from '@/components/box'
import { useFormik } from 'formik'

export const SignInClientPage: React.FC = (): React.ReactNode => {
  const t = useTranslations()

  const locale = useLocale()

  const { setUser } = use(UserContext)

  const [error, setError] = useState<string | null>(null)
  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true)

      const [ok, message, token] = await SessionAPIManager.new({ locale }, values)
      if (ok) {
        const user = await UserAPIManager.get({ token: token!, locale })
        if (!user) {
          setError(t('errors.error'))
          return
        }

        setUser(user)

        toast(t('common.success'))

        window?.location?.replace(`/${locale}/chat`)
      } else {
        setUser(null)

        setError(message || t('errors.error'))
      }

      setSubmitting(false)
    },
    validationSchema: toFormikValidationSchema(signInValidator)
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

      <div>
        <Button loading={formik.isSubmitting} type='submit'>
          {t('common.submit')}
        </Button>
      </div>
    </form>
  )
}
