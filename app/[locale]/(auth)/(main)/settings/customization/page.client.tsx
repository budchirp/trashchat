'use client'

import type React from 'react'
import { use, useState } from 'react'

import { customizationValidator } from '@/lib/validators/customization'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { UserContext } from '@/providers/context/user'
import { CookieMonster } from '@/lib/cookie-monster'
import { Checkbox } from '@/components/checkbox'
import { Field, Label } from '@headlessui/react'
import { UserAPIManager } from '@/lib/api/user'
import { useRouter } from '@/lib/i18n/routing'
import { Button } from '@/components/button'
import { CONSTANTS } from '@/lib/constants'
import { useLocale, useTranslations } from 'next-intl'
import { toast } from '@/components/toast'
import { Input } from '@/components/input'
import { Box } from '@/components/box'
import { Brain } from 'lucide-react'
import { useFormik } from 'formik'
import { Dropdown } from '@/components/dropdown'
import { AIModels, type AIModelID } from '@/lib/ai/models'
import { Seperator } from '@/components/seperator'

const models = AIModels.getAll()

export const CustomizationClientPage: React.FC = (): React.ReactNode => {
  const router = useRouter()

  const { user } = use(UserContext)

  const locale = useLocale()
  const t = useTranslations('settings.customization')
  const t_common = useTranslations('common')

  const cookieMonster = new CookieMonster()

  const [error, setError] = useState<string | null>(null)
  const formik = useFormik({
    initialValues: {
      defaultModel: user?.customization?.defaultModel,
      systemPrompt: user?.customization?.systemPrompt,
      shareInfoWithAI: user?.customization?.shareInfoWithAI
    },
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true)

      const token = cookieMonster.get(CONSTANTS.COOKIES.TOKEN_NAME)
      if (token) {
        const [ok, message] = await UserAPIManager.update({ token, locale }, values)
        if (ok) {
          setError(null)

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
    <form className='grid gap-2 max-w-96 w-full' onSubmit={formik.handleSubmit}>
      {error && (
        <Box variant='primary'>
          <p className='text-red-500'>{error}</p>
        </Box>
      )}

      <div className='grid gap-1'>
        <h2 className='font-medium text-text-tertiary'>{t('default-model')}</h2>

        <Dropdown
          button={
            <Button color='secondary'>
              {models[formik.values.defaultModel as AIModelID].name}
            </Button>
          }
          options={
            (Object.keys(models) as AIModelID[])
              .map((modelName) => {
                const model = models[modelName]

                if (!user?.subscription && model.plus) {
                  return
                }

                return {
                  value: modelName,
                  title: model.name
                }
              })
              .filter(Boolean) as { value: string; title: string }[]
          }
          selected={formik.values.defaultModel}
          onChange={(value) => formik.setFieldValue('defaultModel', value)}
        />
      </div>

      <Seperator />

      <div className='grid gap-2 w-full'>
        <Field>
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
        </Field>
      </div>

      <div>
        <Field className='flex items-center gap-2'>
          <Checkbox
            id='shareInfoWithAI'
            name='shareInfoWithAI'
            checked={formik.values.shareInfoWithAI}
            onChange={(checked) => formik.setFieldValue('shareInfoWithAI', checked)}
          />

          <Label htmlFor='shareInfoWithAI'>{t('share-info')}</Label>
        </Field>
      </div>

      <div>
        <Button loading={formik.isSubmitting} type='submit'>
          {t_common('update')}
        </Button>
      </div>
    </form>
  )
}
