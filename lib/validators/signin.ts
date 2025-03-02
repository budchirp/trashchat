import { z } from 'zod'

export const signInValidator = z.object({
  email: z.string(),
  password: z.string()
})
