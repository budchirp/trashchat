'use client'

import type React from 'react'
import { use, useState } from 'react'

import { toFormikValidationSchema } from 'zod-formik-adapter'
import { signInValidator } from '@/lib/validators/signin'
import { UserContext } from '@/providers/context/user'
import { SessionAPIManager } from '@/lib/api/session'
import { useRouter } from '@/lib/i18n/routing'
import { Button } from '@/components/button'
import { useTranslations } from 'next-intl'
import { Input } from '@/components/input'
import { toast } from '@/components/toast'
import { Lock, Mail } from 'lucide-react'
import { Box } from '@/components/box'
import { useFormik } from 'formik'
import { UserAPIManager } from '@/lib/api/user'

export const SignInClientPage: React.FC = (): React.ReactNode => {
  const router = useRouter()

  const t = useTranslations('auth')
  const t_common = useTranslations('common')

  const { setUser } = use(UserContext)

  const [error, setError] = useState<string | null>(null)
  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true)

      const [success, message, token] = await SessionAPIManager.new(values)
      if (success) {
        const user = await UserAPIManager.get(token!)
        if (!user) {
          setError(t_common('error'))
          return
        }

        setUser(user)

        toast(t_common('success'))

        router.push('/chat')
      } else {
        setUser(null)

        setError(message || t_common('error'))
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
        <div>
          <Input
            id='email'
            name='email'
            type='email'
            autoComplete='email'
            icon={<Mail size={16} />}
            placeholder={t('email')}
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          {formik.errors.email && formik.touched.email && (
            <p className='text-red-500 ms-2'>{formik.errors.email}</p>
          )}
        </div>

        <div>
          <Input
            id='password'
            name='password'
            type='password'
            autoComplete='current-password'
            icon={<Lock size={16} />}
            placeholder={t('password')}
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
  )
}
