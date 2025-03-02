import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createAzure } from '@ai-sdk/azure'
import { Env } from '@/lib/env'

export type AIProvider = 'google' | 'azure'
export type AIModelName = 'gemini-2.0-flash' | 'deepseek-r1' | 'openai-4o-mini'

export class AIModels {
  private static getGoogle = () => {
    const geminiApiKey = Env.geminiApiKey
    if (!geminiApiKey) {
      throw new Error('No gemini api key found!')
    }

    const google = createGoogleGenerativeAI({
      apiKey: geminiApiKey
    })

    return {
      'gemini-2.0-flash': google('gemini-2.0-flash-exp')
    }
  }

  private static getAzure = () => {
    const azureResourceName = Env.azureResourceName
    if (!azureResourceName) {
      throw new Error('No azure resource name found!')
    }

    const azureApiKey = Env.azureApiKey
    if (!azureApiKey) {
      throw new Error('No azure api key found!')
    }

    const azure = createAzure({
      resourceName: azureResourceName,
      apiKey: azureApiKey,
      apiVersion: '2024-05-01-preview'
    })

    return {
      'deepseek-r1': azure('DeepSeek-R1'),
      'openai-4o-mini': azure('gpt-4o-mini')
    }
  }

  private static providerToGetterMap: {
    [key in AIProvider]: () => any
  } = {
    google: this.getGoogle,
    azure: this.getAzure
  }

  public static get = (): {
    [key in AIModelName]: any
  } => {
    let models = {}
    ;(Env.enabledProviders as AIProvider[]).map((provider: AIProvider) => {
      const providerGetter = this.providerToGetterMap[provider]
      if (!providerGetter) {
        return
      }

      const providerModels = providerGetter()
      models = { ...models, ...providerModels }
    })

    return models as any
  }
}
