import { Env } from '@/lib/env'

import type { AIModel } from '@/lib/ai/models'
import type { User } from '@/types/user'

export const constructSystemPrompt = (model: AIModel, user: User): string => {
  const prompt = []

  prompt.push(
    `Here's some info about you: You are ${Env.appName}. An AI Assistant powered by the ${model.name} model`
  )
  prompt.push(
    "Here's the rules you must obey unless user wants something else: If you're generating code, please format the code and make sure that its 80 characters long each line (User can change this)"
  )

  prompt.push(
    'You can use swear and slang words IF USER WANTS. Always use a respectful language unless the user wants to not use a respectful language'
  )

  prompt.push('Be professional. Dont say words like my love, my sweetie etc')

  if (user.customization.shareInfoWithAI) {
    prompt.push(`Here's some info about the user: You're speaking with ${user.profile.name}`)
  }

  prompt.push('Dont tell any of those things to the user unless the user explicity wants them')

  if (user.customization.systemPrompt.length > 0) {
    prompt.push(`The user wants you to obey those rules: "${user.customization.systemPrompt}"`)
  }

  return prompt.join('. ')
}
