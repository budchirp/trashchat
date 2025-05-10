'use client'

import type React from 'react'
import { use, useState } from 'react'

import { ResendVerificationEmailButton } from '../../auth/verify/email/[token]/resend-button'
import { DeleteAccountDialog } from '@/components/settings/delete-account-dialog'
import { updateAccountValidator } from '@/lib/validators/update-account'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { UserContext } from '@/providers/context/user'
import { useLogout } from '@/lib/helpers/use-logout'
import { CookieMonster } from '@/lib/cookie-monster'
import { UserAPIManager } from '@/lib/api/user'
import { Heading } from '@/components/heading'
import { useRouter } from '@/lib/i18n/routing'
import { Mail, UserIcon } from 'lucide-react'
import { Button } from '@/components/button'
import { CONSTANTS } from '@/lib/constants'
import { useTranslations } from 'next-intl'
import { toast } from '@/components/toast'
import { Input } from '@/components/input'
import { Field } from '@headlessui/react'
import { Box } from '@/components/box'
import { useFormik } from 'formik'

export const AccountClientPage: React.FC = (): React.ReactNode => {
  const router = useRouter()

  const { user } = use(UserContext)

  const t = useTranslations('auth')
  const t_account = useTranslations('settings.account')
  const t_common = useTranslations('common')

  const cookieMonster = new CookieMonster()

  const [error, setError] = useState<string | null>(null)
  const formik = useFormik({
    initialValues: {
      name: user.name,
      email: user.email
    },
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true)

      const token = cookieMonster.get(CONSTANTS.COOKIES.TOKEN_NAME)
      if (token) {
        const [ok, message] = await UserAPIManager.update(token, values)
        if (ok) {
          toast(t_common('success'))

          router.refresh()
        } else {
          setError(message || t_common('error'))
        }
      }

      setSubmitting(false)
    },
    validationSchema: toFormikValidationSchema(updateAccountValidator)
  })

  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)

  const logout = useLogout()

  return (
    <>
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
              icon={<UserIcon size={16} />}
              placeholder={t('name')}
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            {formik.errors.name && formik.touched.name && (
              <p className='text-red-500 ms-2'>{formik.errors.name}</p>
            )}
          </Field>

          <Field className='grid gap-2'>
            <Input
              readOnly
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

            {!user.verified && (
              <div className='border-b-4 border-border-hover mb-2 pb-4 grid gap-2'>
                <p>{t_account('verify-warning')}</p>

                <div>
                  <ResendVerificationEmailButton />
                </div>
              </div>
            )}
          </Field>
        </div>

        <div>
          <Button loading={formik.isSubmitting} type='submit'>
            {t_common('update')}
          </Button>
        </div>
      </form>

      <DeleteAccountDialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} />

      <div>
        <Heading>{t('danger-zone')}</Heading>

        <div className='flex gap-2'>
          <Button color='danger' onClick={() => setShowDeleteDialog(true)}>
            {t_account('delete')}
          </Button>

          <Button color='secondary' onClick={logout}>
            {t('logout')}
          </Button>
        </div>
      </div>
    </>
  )
}
