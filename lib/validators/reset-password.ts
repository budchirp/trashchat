import { z } from 'zod'

export const resetPasswordSendMailValidator = z.object({
  email: z.string().email()
})

export const resetPasswordValidator = z.object({
  password: z.string().min(8)
})
