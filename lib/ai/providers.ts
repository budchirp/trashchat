import 'server-only'

import { AIModels, type AIModel, type AIModelID, type AIProvider } from '@/lib/ai/models'
import { createVertexAnthropic } from '@ai-sdk/google-vertex/anthropic'
import { createOpenAI } from '@ai-sdk/openai'
import { createVertex } from '@ai-sdk/google-vertex'
import { createAzure } from '@ai-sdk/azure'
import { Secrets } from '@/lib/secrets'
import { Env } from '@/lib/env'

import type { LanguageModelV1 } from 'ai'

type AIModelWithProvider = {
  provider: (options?: any) => LanguageModelV1
} & AIModel

type AIModelMapWithProvider = {
  [key in AIModelID]: AIModelWithProvider
}

const models = AIModels.get()

export class AIProviders {
  static getOpenAI = (): Partial<AIModelMapWithProvider> => {
    const openaiApiKey = Secrets.openaiApiKey
    if (!openaiApiKey) {
      throw new Error('No OpenAI api key found!')
    }

    const openai = createOpenAI({
      apiKey: openaiApiKey
    })

    return {
      'openai-gpt-4.1': {
        ...models['openai-gpt-4.1'],
        provider: (options) => openai('gpt-4.1-2025-04-14', options)
      },
      'openai-gpt-4.1-mini': {
        ...models['openai-gpt-4.1-mini'],
        provider: (options) => openai('gpt-4.1-mini-2025-04-14', options)
      },
      'openai-gpt-4o-mini': {
        ...models['openai-gpt-4o-mini'],
        provider: (options) => openai('gpt-4o-mini-2024-07-18', options)
      },
      'openai-o3-mini': {
        ...models['openai-o3-mini'],
        provider: (options) => openai('o3-mini-2025-01-31', options)
      },
      'openai-o4-mini': {
        ...models['openai-o4-mini'],
        provider: (options) => openai('o4-mini-2025-04-16', options)
      }
    }
  }

  static getGoogle = (): Partial<AIModelMapWithProvider> => {
    const googleVertexEmail = Secrets.googleVertexEmail
    const googleVertexKey = Secrets.googleVertexKey

    if (!googleVertexEmail || !googleVertexKey) {
      throw new Error('No Google Vertex email or key found!')
    }

    const options = {
      project: process.env.GOOGLE_VERTEX_PROJECT || 'ai-sdk-test',
      googleAuthOptions: {
        credentials: {
          client_email: googleVertexEmail,
          private_key: googleVertexKey
        }
      }
    }

    const google = createVertex({
      ...options,
      location: 'us-central1'
    })
    const googleAnthropic = createVertexAnthropic({
      ...options,
      location: 'europe-west1'
    })

    return {
      'claude-3-7-sonnet': {
        ...models['claude-3-7-sonnet'],
        provider: (options) => googleAnthropic('claude-3-7-sonnet@20250219', options)
      },
      'claude-3-5-sonnet': {
        ...models['claude-3-5-sonnet'],
        provider: (options) => googleAnthropic('claude-3-5-sonnet-v2@20241022', options)
      },
      'gemini-2.5-pro': {
        ...models['gemini-2.5-pro'],
        provider: (options) => google('gemini-2.5-pro-preview-05-06', options)
      },
      'gemini-2.5-flash': {
        ...models['gemini-2.5-flash'],
        provider: (options) => google('gemini-2.5-flash-preview-04-17', options)
      },
      'gemini-2.0-flash': {
        ...models['gemini-2.0-flash'],
        provider: (options) => google('gemini-2.0-flash-001', options)
      }
    }
  }

  static getAzure = (): Partial<AIModelMapWithProvider> => {
    const azureResourceName = Secrets.azureResourceName
    const azureApiKey = Secrets.azureApiKey

    if (!azureResourceName || !azureApiKey) {
      throw new Error('No Azure resource name or key found!')
    }

    const azure = createAzure({
      apiKey: azureApiKey,
      resourceName: azureResourceName,
      apiVersion: '2024-05-01-preview'
    })

    return {
      'deepseek-r1': {
        ...models['deepseek-r1'],
        provider: (options) => azure('DeepSeek-R1', options)
      },
      'openai-gpt-4o-mini': {
        ...models['openai-gpt-4o-mini'],
        provider: (options) => azure('gpt-4o-mini', options)
      },
      'openai-o3-mini': {
        ...models['openai-o3-mini'],
        provider: (options) => azure('o3-mini1', options)
      }
    }
  }

  private static providerToGetterMap: {
    [key in AIProvider]: () => Partial<AIModelMapWithProvider>
  } = {
    google: this.getGoogle,
    openai: this.getOpenAI,
    azure: this.getAzure
  }

  static getAll = (): AIModelMapWithProvider => {
    let models: Partial<AIModelMapWithProvider> = {}
    ;(Env.enabledProviders as AIProvider[]).map((provider: AIProvider) => {
      const providerGetter = this.providerToGetterMap[provider]
      if (!providerGetter) {
        return
      }

      const providerModels = providerGetter()
      models = { ...models, ...providerModels }
    })

    return models as AIModelMapWithProvider
  }

  static get = (modelId: AIModelID): AIModelWithProvider => {
    const allModels = this.getAll()
    const model = allModels[modelId]
    if (!model) {
      throw new Error(`Model "${modelId}" not found!`)
    }

    return model
  }
}
