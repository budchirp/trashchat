import { z } from 'zod'

export const cardValidator = z.object({
  name: z
    .string({
      required_error: 'required'
    })
    .min(1, {
      message: 'min-length'
    }),

  card: z.number({
    required_error: 'required'
  }),
  expiry: z.string({
    required_error: 'required'
  }),
  cvc: z.number({
    required_error: 'required'
  }),

  phone: z
    .string({
      required_error: 'required'
    })
    .min(10, {
      message: 'min-length'
    })
    .max(15, {
      message: 'max-length'
    }),

  address: z
    .string({
      required_error: 'required'
    })
    .min(1, {
      message: 'min-length'
    }),
  city: z
    .string({
      required_error: 'required'
    })
    .min(1, {
      message: 'min-length'
    }),
  zip: z
    .number({
      required_error: 'required'
    })
    .min(1, {
      message: 'min-length'
    }),
  country: z
    .string({
      required_error: 'required'
    })
    .min(1, {
      message: 'min-length'
    })
})
