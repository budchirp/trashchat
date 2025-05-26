'use client'

import type React from 'react'
import { use, useEffect, useState } from 'react'

import { updatePasswordValidator } from '@/lib/validators/update-password'
import { Tablet, Smartphone, Laptop, Clock, Lock } from 'lucide-react'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { useLocale, useTranslations } from 'next-intl'
import { UserContext } from '@/providers/context/user'
import { SessionAPIManager } from '@/lib/api/session'
import { CookieMonster } from '@/lib/cookie-monster'
import { useLogout } from '@/lib/helpers/use-logout'
import { UserAPIManager } from '@/lib/api/user'
import { useRouter } from '@/lib/i18n/routing'
import { Heading } from '@/components/heading'
import { Button } from '@/components/button'
import { CONSTANTS } from '@/lib/constants'
import { toast } from '@/components/toast'
import { Input } from '@/components/input'
import { Field } from '@headlessui/react'
import { Box } from '@/components/box'
import { useFormik } from 'formik'
import jwt from 'jsonwebtoken'

import type { JWTPayload } from '@/types/jwt'

export const CustomizationClientPage: React.FC = (): React.ReactNode => {
  const router = useRouter()

  const { user, refreshUser } = use(UserContext)

  const locale = useLocale()
  const t = useTranslations()

  const cookieMonster = new CookieMonster()

  const [token, setToken] = useState<string | null>(null)
  const [payload, setPayload] = useState<JWTPayload | null>(null)
  useEffect(() => {
    const token = cookieMonster.get(CONSTANTS.COOKIES.TOKEN_NAME)
    if (token) {
      setToken(token)

      setPayload(jwt.decode(token) as JWTPayload)
    }
  }, [])

  const [error, setError] = useState<string | null>(null)
  const formik = useFormik({
    initialValues: {
      password: '',
      newPassword: ''
    },
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true)

      if (token) {
        const [ok, message] = await UserAPIManager.updatePassword({ token, locale }, values)
        if (ok) {
          toast(t('common.success'))

          formik.resetForm()

          router.refresh()
        } else {
          setError(message || t('errors.error'))
        }
      }

      setSubmitting(false)
    },
    validationSchema: toFormikValidationSchema(updatePasswordValidator)
  })

  const logout = useLogout()

  return (
    <>
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
              autoComplete='password'
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

          <Field>
            <Input
              id='newPassword'
              name='newPassword'
              type='password'
              autoComplete='new-password'
              icon={<Lock size={16} />}
              placeholder={t('auth.new-password')}
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            {formik.errors.newPassword && formik.touched.newPassword && (
              <p className='text-red-500 ms-2'>{formik.errors.newPassword}</p>
            )}
          </Field>
        </div>

        <div>
          <Button loading={formik.isSubmitting} type='submit'>
            {t('common.update')}
          </Button>
        </div>
      </form>

      <div>
        <Heading>{t('settings.security.sessions')}</Heading>

        <div className='grid gap-2'>
          {user?.sessions.map((session) => (
            <Box
              variant={payload?.token === session.id ? 'primary' : 'blurry'}
              className='flex items-center justify-between gap-2'
              key={session.id}
            >
              <div className='flex items-center gap-3'>
                {session.platform === 'mobile' ? (
                  <Smartphone />
                ) : session.platform === 'tablet' ? (
                  <Tablet />
                ) : (
                  <Laptop />
                )}

                <div className='grid gap-1'>
                  <h2 className='font-medium'>
                    {session.browser} - {session.os}
                  </h2>
                  <h3 className='text-text-tertiary flex gap-1 items-center'>
                    <Clock size={16} />
                    <span>{new Date(session.expiresAt).toLocaleDateString()}</span>
                  </h3>
                </div>
              </div>

              <Button
                color='secondary'
                onClick={async () => {
                  if (token) {
                    if (payload?.token === session.id) {
                      await logout(token)
                    } else {
                      toast(t('common.loading'))

                      await SessionAPIManager.delete(
                        { token, locale },
                        {
                          token_id: session.id
                        }
                      )

                      toast(t('common.success'))

                      refreshUser()
                    }
                  }
                }}
              >
                {t(
                  payload?.token === session.id ? 'auth.logout' : 'settings.security.delete-session'
                )}
              </Button>
            </Box>
          ))}
        </div>
      </div>
    </>
  )
}
