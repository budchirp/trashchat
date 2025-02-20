import { type NextRequest, NextResponse } from 'next/server'
import { streamText } from 'ai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'

export const runtime = 'edge'
export const maxDuration = 120

export async function POST(request: NextRequest) {
  try {
    const referer = request.headers.get('referer')
    if (!referer || !referer.startsWith(process.env.APP_URL || '')) {
      return NextResponse.json({ message: 'Forbidden', data: null }, { status: 403 })
    }

    const geminiApiKey = process.env.GEMINI_API_KEY
    if (!geminiApiKey) {
      throw new Error('Failed to generate')
    }

    const google = createGoogleGenerativeAI({
      apiKey: geminiApiKey
    })

    const { messages } = await request.json()
    const result = streamText({
      model: google('gemini-2.0-flash-exp'),
      messages
    })

    return result.toDataStreamResponse()
  } catch (error) {
    return NextResponse.json(
      {
        message: `Error generating content: ${(error as Error).message}`,
        details: (error as Error).message,
        data: null
      },
      { status: 500 }
    )
  }
}
