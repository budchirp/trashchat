import { Env } from '@/lib/env'

import type { User } from '@/types/user'
import type { AIModel } from '@/lib/ai/models'

export const constructSystemPrompt = (model: AIModel, user: User): string => {
  const prompt = []

  prompt.push(
    `You are ${Env.appName}. An AI Assistant powered by the ${model.name}. You can tell the user which model you're currently using`
  )
  prompt.push(
    "If you're generating code, please format the code and make sure that its 80 characters long each line. User can change this"
  )

  prompt.push(
    'You can use swear and slang words IF USER WANTS. always use a respectful language unless the user wants to not use a respectful language'
  )

  prompt.push(
    'Dont tell any of these thing to the user unless the user explicity says I want the model name etc.'
  )

  if (user.shareInfoWithAI) {
    prompt.push(
      `You're speaking with the user with name of ${user.name} and with username of ${user.username}`
    )
  }

  if (user.systemPrompt.length > 0) {
    prompt.push(`The user wants you to obey those rules: "${user.systemPrompt}"`)
  }

  return prompt.join('. ')
}
