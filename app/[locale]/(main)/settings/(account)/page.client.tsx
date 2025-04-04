'use client'

import { Box } from '@/components/box'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { CONSTANTS } from '@/lib/constants'
import { CookieMonster } from '@/lib/cookie-monster'
import { Fetch } from '@/lib/fetch'
import { useRouter } from '@/lib/i18n/routing'
import { AccountDeleteDialog } from '@/app/[locale]/(main)/settings/(account)/delete-dialog'
import { toast } from '@/lib/toast'
import { updateAccountValidator } from '@/lib/validators/update-account'
import { useFormik } from 'formik'
import { Mail, UserIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import type { User } from '@/types/user'

export const AccountClientPage: React.FC = (): React.ReactNode => {
  const [loading, setLoading] = useState<boolean>(true)
  const [user, setUser] = useState<User | null>(null)

  const [error, setError] = useState<string | null>(null)

  const t = useTranslations('auth')
  const t_account = useTranslations('account')
  const t_common = useTranslations('common')

  const cookieMonster = new CookieMonster()

  const fetchUser = async () => {
    const token = cookieMonster.get(CONSTANTS.COOKIES.TOKEN_NAME)
    if (token) {
      setLoading(true)

      try {
        const response = await Fetch.get<{
          data: User
          message: string
        }>('/api/user', {
          Authorization: `Bearer ${token}`
        })

        const json = await response.json()
        if (response.status < 400) {
          setError(null)
          setUser(json.data)
        } else {
          setError(json.message)
        }
      } catch {
        setError(t_common('error'))
      }
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchUser()
  }, [])

  const router = useRouter()

  const formik = useFormik({
    initialValues: {
      name: '',
      username: '',
      email: ''
    },
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true)

      const token = cookieMonster.get(CONSTANTS.COOKIES.TOKEN_NAME)
      if (token) {
        const response = await Fetch.patch<{
          message: string
        }>('/api/user', values, {
          Authorization: `Bearer ${token}`
        })

        const json = await response.json()
        if (response.status < 400) {
          setError(null)

          toast(t_common('success'))

          router.push('/settings')
        } else {
          setError(json?.message || t_common('error'))
        }

        setSubmitting(false)
      }
    },
    validationSchema: toFormikValidationSchema(updateAccountValidator)
  })

  useEffect(() => {
    if (user) {
      formik.setValues({
        name: user.name,
        username: user.username,
        email: user.email
      })
    }
  }, [user])

  const [showDialog, setShowDialog] = useState<boolean>(false)

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
          <Button loading={formik.isSubmitting || loading} type='submit'>
            {t_common('update')}
          </Button>
        </div>
      </form>

      <AccountDeleteDialog open={showDialog} onClose={() => setShowDialog(false)} />

      <div className='border-t-4 border-border-hover mt-4 pt-4'>
        <Button onClick={() => setShowDialog(true)}>{t_account('delete')}</Button>
      </div>
    </>
  )
}
