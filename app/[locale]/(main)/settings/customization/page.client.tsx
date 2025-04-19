'use client'

import type React from 'react'
import { useState } from 'react'

import { customizationValidator } from '@/lib/validators/customization'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { CookieMonster } from '@/lib/cookie-monster'
import { Checkbox } from '@/components/checkbox'
import { Box } from '@/components/box'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { CONSTANTS } from '@/lib/constants'
import { useRouter } from '@/lib/i18n/routing'
import { toast } from '@/lib/toast'
import { useFormik } from 'formik'
import { UserAPIManager } from '@/lib/api/user'
import { Brain } from 'lucide-react'
import { useTranslations } from 'next-intl'

import type { User } from '@/types/user'

type CustomizationClientPageProps = {
  user: User
}

export const CustomizationClientPage: React.FC<CustomizationClientPageProps> = ({
  user
}: CustomizationClientPageProps): React.ReactNode => {
  const [error, setError] = useState<string | null>(null)

  const t = useTranslations('customization')
  const t_common = useTranslations('common')

  const cookieMonster = new CookieMonster()
  const router = useRouter()

  const formik = useFormik({
    initialValues: {
      systemPrompt: user.systemPrompt,
      shareInfoWithAI: user.shareInfoWithAI
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
    validationSchema: toFormikValidationSchema(customizationValidator)
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
        <Button loading={formik.isSubmitting} type='submit'>
          {t_common('update')}
        </Button>
      </div>
    </form>
  )
}
