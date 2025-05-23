import { z } from 'zod'

export const updatePasswordValidator = z.object({
  password: z.string(),
  newPassword: z.string().min(8).max(255)
})
