import { z } from 'zod'

export const chatOptionsValidator = z.object({
  title: z.string().min(1),
  shared: z.boolean()
})
