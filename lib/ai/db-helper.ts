import type { Message, MessagePart } from '@prisma/client'
import type { UIMessage } from 'ai'

export const convertMessageToUIMessage = (
  message: Message & { parts: MessagePart[] }
): Omit<UIMessage, 'id'> & { id: number } => {
  return {
    ...message,
    parts: message.parts.map((part) => {
      if (part.type === 'text') {
        return {
          ...part,
          text: part.text
        }
      }

      if (part.type === 'reasoning') {
        return {
          ...part,
          reasoning: part.text
        }
      }

      if (part.type === 'source') {
        const [url, title] = part.text.split(';') || [part.text, null]

        return {
          ...part,
          source: { url, title }
        }
      }
    }) as any
  }
}
