import { z } from 'zod'

export const signUpValidator = z.object({
  name: z.string().min(2).max(20),
  email: z.string().email().min(5).max(255),
  password: z.string().min(8).max(255),
  privacyPolicy: z.literal(true),
  termsOfService: z.literal(true)
})
