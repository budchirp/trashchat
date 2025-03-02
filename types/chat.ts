import type { Chat as PrismaChat } from '@prisma/client'

export type Chat = PrismaChat & {
  id: string
  title: string
}
