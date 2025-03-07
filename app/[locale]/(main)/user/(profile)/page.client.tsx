'use client'

import { Box } from '@/components/box'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { CONSTANTS } from '@/lib/constants'
import { CookieMonster } from '@/lib/cookie-monster'
import { Fetch } from '@/lib/fetch'
import { useRouter } from '@/lib/i18n/routing'
import { toast } from '@/lib/toast'
import { updateProfileValidator } from '@/lib/validators/profile'
import type { User } from '@/types/user'
import { useFormik } from 'formik'
import { Lock, Mail, UserIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { toFormikValidationSchema } from 'zod-formik-adapter'

export const ProfileClientPage: React.FC = (): React.ReactNode => {
  const [loading, setLoading] = useState<boolean>(true)
  const [user, setUser] = useState<User | null>(null)

  const [error, setError] = useState<string | null>(null)

  const t = useTranslations('auth')
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
      email: '',
      password: ''
    },
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true)

      const response = await Fetch.patch<{
        message: string
      }>('/api/user', values)
      const json = await response.json()
      if (response.status >= 400) {
        setError(json?.message || t_common('error'))
      } else {
        toast(t_common('success'))

        router.push('/user')
      }

      setSubmitting(false)
    },
    validationSchema: toFormikValidationSchema(updateProfileValidator)
  })

  useEffect(() => {
    if (user) {
      formik.setValues({
        name: user.name,
        username: user.username,
        email: user.email,
        password: ''
      })
    }
  }, [user])

  return !user || loading ? (
    <div>loading</div>
  ) : (
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
          {t('update')}
        </Button>
      </div>
    </form>
  )
}
