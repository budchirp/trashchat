import type { User as PrismaUser } from '@prisma/client'

export type User = PrismaUser & {
  id: number

  name: string
  username: string

  email: string

  password: string

  profilePicure?: string

  plus: boolean

  credits: number
  premiumCredits: number

  systemPrompt: string

  shareInfoWithAI: boolean
}
