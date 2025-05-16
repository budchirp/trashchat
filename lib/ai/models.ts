import { Env } from '@/lib/env'

export type AIProvider = 'openai' | 'google' | 'azure'
export type AICompany = 'openai' | 'google' | 'deepseek' | 'anthropic'
export type AIModelID =
  | 'openai-gpt-4.1'
  | 'openai-gpt-4.1-mini'
  | 'openai-gpt-4o-mini'
  | 'openai-o3-mini'
  | 'openai-o4-mini'
  | 'claude-3-7-sonnet'
  | 'claude-3-5-sonnet'
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
}

export type AIModelMap = {
  [key in AIModelID]: AIModel
}

export class AIModels {
  private static getOpenAI = (): Partial<AIModelMap> => {
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

        imageGeneration: false
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

        imageGeneration: false
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

        imageGeneration: false
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

        imageGeneration: false
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

        imageGeneration: false
      }
    }
  }

  private static getGoogle = (): Partial<AIModelMap> => {
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

        imageGeneration: false
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

        imageGeneration: false
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

        imageGeneration: false
      },
      'claude-3-7-sonnet': {
        id: 'claude-3-7-sonnet',

        company: 'anthropic',

        name: 'Claude 3.7 Sonnet',

        plus: true,
        premium: true,

        experimental: false,
        recommended: false,

        imageUpload: true,
        fileUpload: true,

        search: false,
        reasoning: true,

        reasoningOptions: ['low', 'medium', 'high'],

        imageGeneration: false
      },
      'claude-3-5-sonnet': {
        id: 'claude-3-5-sonnet',

        company: 'anthropic',

        name: 'Claude 3.5 Sonnet',

        plus: true,
        premium: true,

        experimental: false,
        recommended: false,

        imageUpload: true,
        fileUpload: true,

        search: false,
        reasoning: true,

        reasoningOptions: ['low', 'medium', 'high'],

        imageGeneration: false
      }
    }
  }

  private static getAzure = (): Partial<AIModelMap> => {
    return {
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

        imageGeneration: false
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

        imageGeneration: false
      },
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

        imageGeneration: false
      }
    }
  }

  private static providerToGetterMap: {
    [key in AIProvider]: () => Partial<AIModelMap>
  } = {
    google: this.getGoogle,
    openai: this.getOpenAI,
    azure: this.getAzure
  }

  public static get = (): AIModelMap => {
    let models: Partial<AIModelMap> = {}
    ;(Env.enabledProviders as AIProvider[]).map((provider: AIProvider) => {
      const providerGetter = this.providerToGetterMap[provider]
      if (!providerGetter) {
        return
      }

      models = { ...models, ...providerGetter() }
    })

    return models as AIModelMap
  }
}
