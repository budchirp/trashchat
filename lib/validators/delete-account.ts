import { z } from 'zod'

export const deleteAccountValidator = z.object({
  password: z.string()
})
