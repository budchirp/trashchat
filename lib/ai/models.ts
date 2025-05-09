import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createOpenAI } from '@ai-sdk/openai'
import { createAzure } from '@ai-sdk/azure'
import { AISecrets } from '@/lib/ai/secrets'
import { Env } from '@/lib/env'

import type { LanguageModelV1 } from 'ai'

export type AIProvider = 'openai' | 'google' | 'azure'
export type AICompany = 'openai' | 'google' | 'deepseek'
export type AIModelID =
  | 'openai-gpt-4.1'
  | 'openai-gpt-4.1-mini'
  | 'openai-gpt-4o-mini'
  | 'openai-o3-mini'
  | 'openai-o4-mini'
  | 'gemini-2.0-flash-image-generation'
  | 'gemini-2.0-flash'
  | 'gemini-2.5-flash'
  | 'gemini-2.5-pro'
  | 'deepseek-r1'

export type AIModelReasoningOption = 'low' | 'medium' | 'high'

export type AIModel = {
  id: AIModelID

  company: AICompany

  name: string

  plus: boolean
  premium: boolean

  experimental: boolean
  recommended: boolean

  imageUpload: boolean
  fileUpload: boolean

  search: boolean
  reasoning: boolean

  reasoningOptions: AIModelReasoningOption[]

  imageGeneration: boolean

  provider: (options?: any) => LanguageModelV1
}

export type AIModelMap = {
  [key in AIModelID]: AIModel
}

export class AIModels {
  private static getOpenAI = (withProvider: boolean): Partial<AIModelMap> => {
    let provider: (model: string, options?: any) => LanguageModelV1 = () => null as any
    if (withProvider) {
      const openaiApiKey = AISecrets.openaiApiKey
      if (!openaiApiKey) {
        throw new Error('No OpenAI api key found!')
      }

      const openai = createOpenAI({
        apiKey: openaiApiKey
      })

      provider = (model: string, options?: any) => openai(model, options)
    }

    return {
      'openai-gpt-4.1': {
        id: 'openai-gpt-4.1',

        company: 'openai',

        name: 'OpenAI GPT-4.1',

        plus: true,
        premium: true,

        experimental: false,
        recommended: false,

        imageUpload: true,
        fileUpload: false,

        search: true,
        reasoning: false,

        reasoningOptions: [],

        imageGeneration: false,

        provider: (options) => provider('gpt-4.1-2025-04-14', options)
      },
      'openai-gpt-4.1-mini': {
        id: 'openai-gpt-4.1-mini',

        company: 'openai',

        name: 'OpenAI GPT-4.1 mini',

        plus: true,
        premium: false,

        experimental: false,
        recommended: false,

        imageUpload: true,
        fileUpload: false,

        search: false,
        reasoning: false,

        reasoningOptions: [],

        imageGeneration: false,

        provider: (options) => provider('gpt-4.1-mini-2025-04-14', options)
      },
      'openai-gpt-4o-mini': {
        id: 'openai-gpt-4o-mini',

        company: 'openai',

        name: 'OpenAI GPT-4o mini',

        plus: true,
        premium: false,

        experimental: false,
        recommended: false,

        imageUpload: true,
        fileUpload: false,

        search: false,
        reasoning: false,

        reasoningOptions: [],

        imageGeneration: false,

        provider: (options) => provider('gpt-4o-mini-2024-07-18', options)
      },
      'openai-o3-mini': {
        id: 'openai-o3-mini',

        company: 'openai',

        name: 'OpenAI o3 mini',

        plus: true,
        premium: true,

        experimental: false,
        recommended: false,

        imageUpload: true,
        fileUpload: false,

        search: false,
        reasoning: true,

        reasoningOptions: ['low', 'medium', 'high'],

        imageGeneration: false,

        provider: (options) => provider('o3-mini-2025-01-31', options)
      },
      'openai-o4-mini': {
        id: 'openai-o4-mini',

        company: 'openai',

        name: 'OpenAI o4 mini',

        plus: true,
        premium: true,

        experimental: false,
        recommended: true,

        imageUpload: true,
        fileUpload: false,

        search: false,
        reasoning: true,

        reasoningOptions: ['low', 'medium', 'high'],

        imageGeneration: false,

        provider: (options) => provider('o4-mini-2025-04-16', options)
      }
    }
  }

  private static getGoogle = (withProvider: boolean): Partial<AIModelMap> => {
    let provider: (model: string, options?: any) => LanguageModelV1 = () => null as any
    if (withProvider) {
      const geminiApiKey = AISecrets.geminiApiKey
      if (!geminiApiKey) {
        throw new Error('No gemini api key found!')
      }

      const google = createGoogleGenerativeAI({
        apiKey: geminiApiKey
      })

      provider = (model: string, options?: any) => google(model, options)
    }

    return {
      'gemini-2.5-pro': {
        id: 'gemini-2.5-pro',

        company: 'google',

        name: 'Gemini 2.5 Pro',

        plus: true,
        premium: false,

        experimental: true,
        recommended: true,

        imageUpload: true,
        fileUpload: true,

        search: true,
        reasoning: true,

        reasoningOptions: ['low', 'medium', 'high'],

        imageGeneration: false,

        provider: (options) => provider('gemini-2.5-pro-exp-03-25', options)
      },
      'gemini-2.5-flash': {
        id: 'gemini-2.5-flash',

        company: 'google',

        name: 'Gemini 2.5 Flash',

        plus: false,
        premium: false,

        experimental: true,
        recommended: true,

        imageUpload: true,
        fileUpload: true,

        search: true,
        reasoning: true,

        reasoningOptions: ['low', 'medium', 'high'],

        imageGeneration: false,

        provider: (options) => provider('gemini-2.5-flash-preview-04-17', options)
      },
      'gemini-2.0-flash': {
        id: 'gemini-2.0-flash',

        company: 'google',

        name: 'Gemini 2.0 Flash',

        plus: false,
        premium: false,

        experimental: false,
        recommended: false,

        imageUpload: true,
        fileUpload: true,

        search: true,
        reasoning: false,

        reasoningOptions: [],

        imageGeneration: false,

        provider: (options) => provider('gemini-2.0-flash-exp', options)
      },
      'gemini-2.0-flash-image-generation': {
        id: 'gemini-2.0-flash-image-generation',

        company: 'google',

        name: 'Gemini 2.0 Flash Image Generation',

        plus: true,
        premium: true,

        experimental: true,
        recommended: false,

        imageUpload: true,
        fileUpload: false,

        search: false,
        reasoning: false,

        reasoningOptions: [],

        imageGeneration: true,

        provider: (options) => provider('gemini-2.0-flash-preview-image-generation', options)
      }
    }
  }

  private static getAzure = (withProvider: boolean): Partial<AIModelMap> => {
    let provider: (model: string, options?: any) => LanguageModelV1 = () => null as any
    if (withProvider) {
      const azureResourceName = AISecrets.azureResourceName
      if (!azureResourceName) {
        throw new Error('No azure resource name found!')
      }

      const azureApiKey = AISecrets.azureApiKey
      if (!azureApiKey) {
        throw new Error('No azure api key found!')
      }

      const azure = createAzure({
        resourceName: azureResourceName,
        apiKey: azureApiKey,
        apiVersion: '2024-05-01-preview'
      }) as any

      provider = (model: string, options?: any) => azure(model, options)
    }

    return {
      'deepseek-r1': {
        id: 'deepseek-r1',

        company: 'deepseek',

        name: 'DeepSeek R1',

        plus: true,
        premium: false,

        experimental: false,
        recommended: false,

        imageUpload: false,
        fileUpload: false,

        search: false,
        reasoning: true,

        reasoningOptions: [],

        imageGeneration: false,

        provider: (options) => provider('DeepSeek-R1', options)
      },
      'openai-gpt-4o-mini': {
        id: 'openai-gpt-4o-mini',

        company: 'openai',

        name: 'OpenAI GPT-4o mini',

        plus: true,
        premium: false,

        experimental: false,
        recommended: false,

        imageUpload: true,
        fileUpload: false,

        search: false,
        reasoning: false,

        reasoningOptions: [],

        imageGeneration: false,

        provider: (options) => provider('gpt-4o-mini', options)
      },
      'openai-o3-mini': {
        id: 'openai-o3-mini',

        company: 'openai',

        name: 'OpenAI o3 mini',

        plus: true,
        premium: true,

        experimental: false,
        recommended: false,

        imageUpload: true,
        fileUpload: false,

        search: false,
        reasoning: true,

        reasoningOptions: ['low', 'medium', 'high'],

        imageGeneration: false,

        provider: (options) => provider('o3-mini', options)
      }
    }
  }

  private static providerToGetterMap: {
    [key in AIProvider]: (withProvider: boolean) => Partial<AIModelMap>
  } = {
    google: this.getGoogle,
    openai: this.getOpenAI,
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
