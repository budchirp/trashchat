import type { Profile, AICustomization, Subscription, Usages, Session } from '@prisma/client'

export type User = {
  id: number

  email: string

  isEmailVerified: boolean

  emailVerificationToken: string
  lastEmailSentAt: Date | null

  password: string

  firstUsageAt: Date | null

  profile: Profile
  customization: AICustomization
  usages: Usages

  subscription?: Subscription

  sessions: Session[]
}
