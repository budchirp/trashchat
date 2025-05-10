'use client'

import type React from 'react'
import { useState } from 'react'

import { Button } from '@/components/button'
import { useTranslations } from 'next-intl'
import { Input } from '@/components/input'
import { Field } from '@headlessui/react'
import {
  CreditCard,
  Globe,
  Lock,
  MapPin,
  Phone,
  User,
  CalendarDays,
  Mail,
  Package,
  House
} from 'lucide-react'
import { Box } from '@/components/box'
import { useFormik } from 'formik'
import { Seperator } from '@/components/seperator'
import { cardValidator } from '@/lib/validators/card'
import { Fetch } from '@/lib/fetch'
import { CookieMonster } from '@/lib/cookie-monster'

import type { APIResponse } from '@/types/api'
import { toFormikValidationSchema } from 'zod-formik-adapter'

export const CardForm: React.FC = (): React.ReactNode => {
  const t = useTranslations('subscribe.payment')
  const t_all = useTranslations()

  const cookieMonster = new CookieMonster()

  const [error, setError] = useState<string | null>(null)
  const formik = useFormik({
    initialValues: {
      name: 'John Doe',

      card: 5170410000000004,
      cvc: 123,
      expiry: '12/2025',

      phone: '+905555555555',

      address: '123 Main St',
      city: 'Istanbul',
      zip: 12345,
      country: 'Turkey'
    },
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true)

      const token = cookieMonster.get('token')
      if (token) {
        const response = await Fetch.post<APIResponse>('/api/payment/card/init', values, {
          Authorization: `Bearer ${token}`
        })

        // TODO: DEAL WITH GARBAGE IYZICO API
        const json = await response.json()
        if (response.ok) {
          console.log(json)
        } else {
          setError(json.message || t_all('errors.error'))
        }
      }

      setSubmitting(false)
    },
    validationSchema: toFormikValidationSchema(cardValidator)
  })

  return (
    <form className='grid gap-2' onSubmit={formik.handleSubmit}>
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
            autoComplete='cc-name'
            icon={<User size={16} />}
            placeholder={t('form.name')}
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
            id='card'
            name='card'
            type='number'
            autoComplete='card'
            icon={<CreditCard size={16} />}
            placeholder={t('form.card')}
            value={formik.values.card}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          {formik.errors.card && formik.touched.card && (
            <p className='text-red-500 ms-2'>{formik.errors.card}</p>
          )}
        </Field>

        <div className='flex gap-2'>
          <Field>
            <Input
              id='cvc'
              name='cvc'
              type='number'
              autoComplete='cc-csc'
              icon={<Lock size={16} />}
              placeholder={t('form.cvc')}
              value={formik.values.cvc}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.cvc && formik.touched.cvc && (
              <p className='text-red-500 ms-2'>{formik.errors.cvc}</p>
            )}
          </Field>

          <Field>
            <Input
              id='expiry'
              name='expiry'
              type='text'
              autoComplete='cc-exp'
              icon={<CalendarDays size={16} />}
              placeholder={t('form.expiry')}
              value={formik.values.expiry}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.expiry && formik.touched.expiry && (
              <p className='text-red-500 ms-2'>{formik.errors.expiry}</p>
            )}
          </Field>
        </div>

        <Seperator />

        <Field>
          <Input
            id='phone'
            name='phone'
            type='tel'
            autoComplete='tel'
            icon={<Phone size={16} />}
            placeholder={t('form.phone')}
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.phone && formik.touched.phone && (
            <p className='text-red-500 ms-2'>{formik.errors.phone}</p>
          )}
        </Field>

        <Seperator />

        <Field>
          <Input
            textarea
            id='address'
            name='address'
            type='text'
            autoComplete='street-address'
            icon={<House size={16} />}
            placeholder={t('form.address')}
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.address && formik.touched.address && (
            <p className='text-red-500 ms-2'>{formik.errors.address}</p>
          )}
        </Field>

        <div className='flex gap-2'>
          <Field>
            <Input
              id='city'
              name='city'
              type='text'
              autoComplete='address-level2'
              icon={<MapPin size={16} />}
              placeholder={t('form.city')}
              value={formik.values.city}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.city && formik.touched.city && (
              <p className='text-red-500 ms-2'>{formik.errors.city}</p>
            )}
          </Field>

          <Field>
            <Input
              id='zip'
              name='zip'
              type='number'
              autoComplete='postal-code'
              icon={<Package size={16} />}
              placeholder={t('form.zip')}
              value={formik.values.zip}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.zip && formik.touched.zip && (
              <p className='text-red-500 ms-2'>{formik.errors.zip}</p>
            )}
          </Field>
        </div>

        <Field>
          <Input
            id='country'
            name='country'
            type='text'
            autoComplete='country-name'
            icon={<Globe size={16} />}
            placeholder={t('form.country')}
            value={formik.values.country}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.country && formik.touched.country && (
            <p className='text-red-500 ms-2'>{formik.errors.country}</p>
          )}
        </Field>
      </div>

      <div>
        <Button loading={formik.isSubmitting} type='submit'>
          {t('pay-with-card')}
        </Button>
      </div>
    </form>
  )
}
