import { type NextRequest, NextResponse } from 'next/server'
import { smoothStream, streamText } from 'ai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createAzure } from '@ai-sdk/azure'

export const runtime = 'edge'
export const maxDuration = 120

const geminiApiKey = process.env.GEMINI_API_KEY
if (!geminiApiKey) {
  throw new Error('No gemini api key found!')
}

const azureResourceName = process.env.AZURE_RESOURCE_NAME
if (!azureResourceName) {
  throw new Error('No azure resource name found!')
}
const azureApiKey = process.env.AZURE_API_KEY
if (!azureApiKey) {
  throw new Error('No azure api key found!')
}

const google = createGoogleGenerativeAI({
  apiKey: geminiApiKey
})

const azure = createAzure({
  resourceName: azureResourceName,
  apiKey: azureApiKey,
  apiVersion: '2024-05-01-preview'
})

const models = {
  'gemini-2.0-flash': google('gemini-2.0-flash-exp'),
  'deepseek-r1': azure('DeepSeek-R1'),
  'openai-4o-mini': azure('gpt-4o-mini')
}

export async function POST(request: NextRequest) {
  try {
    const referer = request.headers.get('referer')
    if (!referer || !referer.startsWith(process.env.APP_URL || '')) {
      return NextResponse.json({ message: 'Forbidden', data: null }, { status: 403 })
    }

    // disabled because I dont have any security to prevent bots and spam requests. I dont wanna bankrupt my mothers credit card lol
    const { messages /* model */ } = await request.json()
    const model = null
    const result = streamText({
      model: model ? models[model as keyof typeof models] : models['gemini-2.0-flash'],
      messages,
      experimental_transform: smoothStream()
    })

    return result.toDataStreamResponse({
      getErrorMessage: (error: unknown) => {
        console.log(error)

        return 'Error while generating content. Please try again'
      },
      headers: {
        'Transfer-Encoding': 'chunked',
        Connection: 'keep-alive'
      }
    })
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Error while generating content. Please try again',
        details: (error as Error).message
      },
      { status: 500 }
    )
  }
}
