'use client'

import { Box } from '@/components/box'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { CONSTANTS } from '@/lib/constants'
import { CookieMonster } from '@/lib/cookie-monster'
import { Fetch } from '@/lib/fetch'
import { useRouter } from '@/lib/i18n/routing'
import { toast } from '@/lib/toast'
import { customizationValidator } from '@/lib/validators/customization'
import { useFormik } from 'formik'
import { Brain } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import type { User } from '@/types/user'
import { Checkbox } from '@/components/checkbox'

export const CustomizationClientPage: React.FC = (): React.ReactNode => {
  const [loading, setLoading] = useState<boolean>(true)
  const [user, setUser] = useState<User | null>(null)

  const [error, setError] = useState<string | null>(null)

  const t = useTranslations('customization')
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
      systemPrompt: '',
      shareInfoWithAI: false
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

          router.push('/settings/customization')
        } else {
          setError(json?.message || t_common('error'))
        }

        setSubmitting(false)
      }
    },
    validationSchema: toFormikValidationSchema(customizationValidator)
  })

  useEffect(() => {
    if (user) {
      formik.setValues({
        systemPrompt: user.systemPrompt,
        shareInfoWithAI: user.shareInfoWithAI
      })
    }
  }, [user])

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
            id='systemPrompt'
            name='systemPrompt'
            type='text'
            icon={<Brain size={16} />}
            placeholder={t('prompt')}
            value={formik.values.systemPrompt}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            textarea
          />

          {formik.errors.systemPrompt && formik.touched.systemPrompt && (
            <p className='text-red-500 ms-2'>{formik.errors.systemPrompt}</p>
          )}
        </div>

        <div>
          <Checkbox
            id='shareInfoWithAI'
            name='shareInfoWithAI'
            type='checkbox'
            checked={formik.values.shareInfoWithAI}
            onChange={formik.handleChange}
            label={t('share-info')}
          />
        </div>
      </div>

      <div>
        <Button loading={formik.isSubmitting || loading} type='submit'>
          {t_common('update')}
        </Button>
      </div>
    </form>
  )
}
