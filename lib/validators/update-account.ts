import { z } from 'zod'

export const updateAccountValidator = z.object({
  name: z.string().min(2).max(20),
  username: z.string().min(2).max(16),
  email: z.string().email().min(5).max(255)
})
