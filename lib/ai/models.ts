import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createAzure } from '@ai-sdk/azure'
import { Env } from '@/lib/env'
import type { LanguageModelV1 } from 'ai'

export type AIProvider = 'google' | 'azure'
export type AIModelID = 'gemini-2.0-flash' | 'deepseek-r1' | 'openai-gpt-4o-mini' | 'openai-o3-mini'

export type AIModel = {
  id: AIModelID

  name: string

  plus: boolean
  premium: boolean

  provider: LanguageModelV1
}

export type AIModelMap = {
  [key in AIModelID]: AIModel
}

export class AIModels {
  private static getGoogle = (withProvider: boolean): Partial<AIModelMap> => {
    let provider: (model: string) => LanguageModelV1 = () => null as any
    if (withProvider) {
      const geminiApiKey = Env.geminiApiKey
      if (!geminiApiKey) {
        throw new Error('No gemini api key found!')
      }

      const google = createGoogleGenerativeAI({
        apiKey: geminiApiKey
      })

      provider = (model: string) => google(model)
    }

    return {
      'gemini-2.0-flash': {
        id: 'gemini-2.0-flash',

        name: 'Gemini 2.0 Flash',

        plus: false,
        premium: false,

        provider: provider('gemini-2.0-flash-exp')
      }
    }
  }

  private static getAzure = (withProvider: boolean): Partial<AIModelMap> => {
    let provider: (model: string) => LanguageModelV1 = () => null as any
    if (withProvider) {
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
      }) as any

      provider = (model: string) => azure(model)
    }

    return {
      'deepseek-r1': {
        id: 'deepseek-r1',

        name: 'DeepSeek R1',

        plus: true,
        premium: false,

        provider: provider('DeepSeek-R1')
      },
      'openai-gpt-4o-mini': {
        id: 'openai-gpt-4o-mini',

        name: 'OpenAI GPT-4o mini',

        plus: true,
        premium: false,

        provider: provider('gpt-4o-mini')
      },
      'openai-o3-mini': {
        id: 'openai-o3-mini',

        name: 'OpenAI o3 mini',

        plus: true,
        premium: true,

        provider: provider('gpt-4o-mini')
      }
    }
  }

  private static providerToGetterMap: {
    [key in AIProvider]: (withProvider: boolean) => Partial<AIModelMap>
  } = {
    google: this.getGoogle,
    azure: this.getAzure
  }

  public static get = (withProvider: boolean = true): AIModelMap => {
    let models: Partial<AIModelMap> = {}
    ;(Env.enabledProviders as AIProvider[]).map((provider: AIProvider) => {
      const providerGetter = this.providerToGetterMap[provider]
      if (!providerGetter) {
        return
      }

      const providerModels = providerGetter(withProvider)
      models = { ...models, ...providerModels }
    })

    return models as AIModelMap
  }
}
