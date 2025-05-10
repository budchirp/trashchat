'use client'

import type React from 'react'
import { useRef, useState } from 'react'

import { toFormikValidationSchema } from 'zod-formik-adapter'
import { signUpValidator } from '@/lib/validators/signup'
import { UserAPIManager } from '@/lib/api/user'
import { Lock, Mail, User } from 'lucide-react'
import ReCAPTCHA from 'react-google-recaptcha'
import { useRouter } from '@/lib/i18n/routing'
import { Button } from '@/components/button'
import { useTranslations } from 'next-intl'
import { toast } from '@/components/toast'
import { Input } from '@/components/input'
import { Field } from '@headlessui/react'
import { Box } from '@/components/box'
import { Fetch } from '@/lib/fetch'
import { useFormik } from 'formik'
import { Env } from '@/lib/env'

type SignUpClientPageProps = {
  captchaSiteKey: string
}

export const SignUpClientPage: React.FC<SignUpClientPageProps> = ({
  captchaSiteKey
}: SignUpClientPageProps): React.ReactNode => {
  const router = useRouter()

  const t = useTranslations('auth')
  const t_common = useTranslations('common')

  const captchaRef = useRef(null)

  const [error, setError] = useState<string | null>(null)
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: ''
    },
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true)

      if (captchaRef.current) {
        const captcha = (captchaRef.current as any).getValue()
        if (!captcha) {
          setError(t('captcha-error'))
          return
        }

        const response = await Fetch.post<{
          data: {
            success: boolean
          }
        }>(`${Env.appUrl}/api/captcha`, {
          captcha
        })

        if (response.ok) {
          const json = await response.json()
          if (!json.data.success) {
            setError(t('captcha-error'))
            return
          }
        } else {
          setError(t('captcha-error'))
          return
        }
      }

      const [ok, message] = await UserAPIManager.new(values)
      if (ok) {
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
        <Field>
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
        </Field>

        <Field>
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
        </Field>

        <Field>
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
        </Field>

        <div>
          <ReCAPTCHA ref={captchaRef} sitekey={captchaSiteKey} />
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
