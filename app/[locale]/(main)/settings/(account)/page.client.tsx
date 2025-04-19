'use client'

import type React from 'react'
import { useEffect, useState } from 'react'

import { AccountDeleteDialog } from '@/app/[locale]/(main)/settings/(account)/delete-dialog'
import { updateAccountValidator } from '@/lib/validators/update-account'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { CookieMonster } from '@/lib/cookie-monster'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { CONSTANTS } from '@/lib/constants'
import { UserAPIManager } from '@/lib/api/user'
import { SessionAPIManager } from '@/lib/api/session'
import { useRouter } from '@/lib/i18n/routing'
import { toast } from '@/lib/toast'
import { useFormik } from 'formik'
import { Mail, UserIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Box } from '@/components/box'

import type { User } from '@/types/user'

type AccountClientPageProps = {
  user: User
}

export const AccountClientPage: React.FC<AccountClientPageProps> = ({
  user
}: AccountClientPageProps): React.ReactNode => {
  const [error, setError] = useState<string | null>(null)

  const t = useTranslations('auth')
  const t_account = useTranslations('account')
  const t_common = useTranslations('common')

  const cookieMonster = new CookieMonster()
  const router = useRouter()

  const formik = useFormik({
    initialValues: {
      name: user.name,
      username: user.username,
      email: user.email
    },
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true)

      const token = cookieMonster.get(CONSTANTS.COOKIES.TOKEN_NAME)
      if (token) {
        const [success, message] = await UserAPIManager.update(token, values as any)
        if (success) {
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

  return (
    <>
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
              icon={<UserIcon size={16} />}
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
              icon={<UserIcon size={16} />}
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
          </div>
        </div>

        <div>
          <Button loading={formik.isSubmitting} type='submit'>
            {t_common('update')}
          </Button>
        </div>
      </form>

      <AccountDeleteDialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} />

      <div className='border-t-4 border-border-hover mt-4 pt-4 flex gap-2'>
        <Button onClick={() => setShowDeleteDialog(true)}>{t_account('delete')}</Button>

        <Button
          color='secondary'
          onClick={async () => {
            await SessionAPIManager.delete()

            toast(t_common('success'))

            router.push('/')
          }}
        >
          {t('logout')}
        </Button>
      </div>
    </>
  )
}
