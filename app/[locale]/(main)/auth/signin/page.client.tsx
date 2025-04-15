'use client'

import type React from 'react'
import { useState } from 'react'

import { Input } from '@/components/input'
import { Lock, Mail } from 'lucide-react'
import { Button } from '@/components/button'
import { useTranslations } from 'next-intl'
import { useFormik } from 'formik'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { signInValidator } from '@/lib/validators/signin'
import { Box } from '@/components/box'
import { toast } from '@/lib/toast'
import { useRouter } from '@/lib/i18n/routing'
import { CookieMonster } from '@/lib/cookie-monster'
import { CONSTANTS } from '@/lib/constants'
import { SessionAPIManager } from '@/lib/session'

export const SignInClientPage: React.FC = (): React.ReactNode => {
  const t = useTranslations('auth')
  const t_common = useTranslations('common')

  const [error, setError] = useState<string | null>(null)

  const router = useRouter()

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true)

      const [success, message, token] = await SessionAPIManager.new(values)
      if (success) {
        toast(t_common('success'))

        const cookieMonster = new CookieMonster()
        cookieMonster.set(CONSTANTS.COOKIES.TOKEN_NAME, token, {
          expires: new Date(2147483647000)
        })

        router.push('/chat')
      } else {
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
