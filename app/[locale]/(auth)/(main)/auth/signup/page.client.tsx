'use client'

import type React from 'react'
import { useRef, useState } from 'react'

import { toFormikValidationSchema } from 'zod-formik-adapter'
import { signUpValidator } from '@/lib/validators/signup'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter, Link } from '@/lib/i18n/routing'
import { Checkbox } from '@/components/checkbox'
import { UserAPIManager } from '@/lib/api/user'
import { Lock, Mail, User } from 'lucide-react'
import ReCAPTCHA from 'react-google-recaptcha'
import { Button } from '@/components/button'
import { toast } from '@/components/toast'
import { Input } from '@/components/input'
import { Field, Label } from '@headlessui/react'
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

  const locale = useLocale()

  const t = useTranslations()

  const captchaRef = useRef(null)

  const [error, setError] = useState<string | null>(null)
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      privacyPolicy: false,
      termsOfService: false
    },
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true)

      if (captchaRef.current) {
        const captcha = (captchaRef.current as any).getValue()
        if (!captcha) {
          setError(t('errors.captcha-error'))
          return
        }

        const response = await Fetch.post<{
          data: {
            success: boolean
          }
        }>(
          `${Env.appUrl}/api/captcha`,
          {
            captcha
          },
          {
            'accept-language': locale || 'en'
          }
        )

        if (response.ok) {
          const json = await response.json()
          if (!json.data.success) {
            setError(t('errors.captcha-error'))
            return
          }
        } else {
          setError(t('errors.captcha-error'))
          return
        }
      }

      const [ok, message] = await UserAPIManager.new({ locale }, values)
      if (ok) {
        toast(t('common.success'))

        router.push('/auth/signin')
      } else {
        setError(message || t('errors.error'))
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
            placeholder={t('auth.name')}
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

        <div>
          <Field className='flex items-center gap-2'>
            <Checkbox
              id='privacyPolicy'
              name='privacyPolicy'
              checked={formik.values.privacyPolicy}
              onChange={(checked) => formik.setFieldValue('privacyPolicy', checked)}
            />

            <Label>
              <Link href='/legal/privacy-policy'>{t('auth.signup.privacy-policy')}</Link>
            </Label>
          </Field>

          {formik.errors.privacyPolicy && formik.touched.privacyPolicy && (
            <p className='text-red-500'>{formik.errors.privacyPolicy}</p>
          )}
        </div>

        <div>
          <Field className='flex items-center gap-2'>
            <Checkbox
              id='termsOfService'
              name='termsOfService'
              checked={formik.values.termsOfService}
              onChange={(checked) => formik.setFieldValue('termsOfService', checked)}
            />

            <Label>
              <Link href='/legal/terms-of-service'>{t('auth.signup.tos')}</Link>
            </Label>
          </Field>

          {formik.errors.termsOfService && formik.touched.termsOfService && (
            <p className='text-red-500'>{formik.errors.termsOfService}</p>
          )}
        </div>

        <div>
          <ReCAPTCHA ref={captchaRef} sitekey={captchaSiteKey} />
        </div>
      </div>

      <div>
        <Button loading={formik.isSubmitting} type='submit'>
          {t('common.submit')}
        </Button>
      </div>
    </form>
  )
}
