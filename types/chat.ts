import type { AIModelID } from '@/lib/ai/models'
import type { Message, Chat as PrismaChat } from '@prisma/client'

export type Chat = PrismaChat & {
  id: string

  title: string
  model?: AIModelID

  messages: Message[]
}
