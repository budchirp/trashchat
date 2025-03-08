import { z } from 'zod'

export const customizationValidator = z.object({
  prompt: z.string().optional()
})
