'use client'

import type React from 'react'
import { useState } from 'react'

import { toFormikValidationSchema } from 'zod-formik-adapter'
import { signUpValidator } from '@/lib/validators/signup'
import { UserAPIManager } from '@/lib/api/user'
import { Lock, Mail, User } from 'lucide-react'
import { Input } from '@/components/input'
import { Button } from '@/components/button'
import { useTranslations } from 'next-intl'
import { useFormik } from 'formik'
import { Box } from '@/components/box'
import { toast } from '@/lib/toast'
import { useRouter } from '@/lib/i18n/routing'

export const SignUpClientPage: React.FC = (): React.ReactNode => {
  const t = useTranslations('auth')
  const t_common = useTranslations('common')

  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const formik = useFormik({
    initialValues: {
      name: '',
      username: '',
      email: '',
      password: ''
    },
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true)

      const [success, message] = await UserAPIManager.new(values)
      if (success) {
        toast(t_common('success'))

        router.push('/auth/signin')
      } else {
        setError(message || t_common('error'))
      }

      setSubmitting(false)
    },
    validationSchema: toFormikValidationSchema(signUpValidator)
  })

  return (
    <form className='grid text-start gap-2 max-w-96 w-full' onSubmit={formik.handleSubmit}>
      {error && (
        <Box variant='primary'>
          <p className='text-red-500'>{error}</p>
        </Box>
      )}

      <div className='grid gap-2 w-full'>
        <div>
          <Input
            id='name'
            name='name'
            type='text'
            autoComplete='name'
            icon={<User size={16} />}
            placeholder={t('name')}
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          {formik.errors.name && formik.touched.name && (
            <p className='text-red-500 ms-2'>{formik.errors.name}</p>
          )}
        </div>

        <div>
          <Input
            id='username'
            name='username'
            type='text'
            autoComplete='off'
            icon={<User size={16} />}
            placeholder={t('username')}
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          {formik.errors.username && formik.touched.username && (
            <p className='text-red-500 ms-2'>{formik.errors.username}</p>
          )}
        </div>

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
