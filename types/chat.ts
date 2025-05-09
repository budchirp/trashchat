import type { AIModelID } from '@/lib/ai/models'
import type { File, Message, Chat as PrismaChat } from '@prisma/client'

export type Chat = PrismaChat & {
  model: AIModelID

  messages: Message[] & {
    files: File[]
  }
}
