'use client'

import type React from 'react'
import { useState } from 'react'

import { Input } from '@/components/input'
import { Lock, Mail, User } from 'lucide-react'
import { Button } from '@/components/button'
import { useTranslations } from 'next-intl'
import { useFormik } from 'formik'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { signUpValidator } from '@/lib/validators/signup'
import { Box } from '@/components/box'
import { Fetch } from '@/lib/fetch'
import { toast } from '@/lib/toast'
import { useRouter } from '@/lib/i18n/routing'

const SignUpClientPage: React.FC = (): React.ReactNode => {
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

      const response = await Fetch.post<{
        message: string
        data: any
      }>('/api/user', values)
      const json = await response.json()
      if (response.status >= 400) {
        setError(json?.message || t_common('error'))
      } else {
        toast(t_common('success'))

        router.push('/auth/signin')
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

      <Button loading={formik.isSubmitting} type='submit'>
        {t_common('submit')}
      </Button>
    </form>
  )
}

export default SignUpClientPage
