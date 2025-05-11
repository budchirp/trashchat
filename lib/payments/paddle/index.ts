import { Secrets } from '@/lib/secrets'
import { Environment, LogLevel, Paddle, type PaddleOptions } from '@paddle/paddle-node-sdk'

const options: PaddleOptions = {
  environment: Environment.sandbox,
  logLevel: LogLevel.error
}

const paddleApiKey = Secrets.paddleApiKey
if (!paddleApiKey) {
  throw new Error('Paddle API key is not set')
}

const paddleWebhookSecret = Secrets.paddleWebhookSecret
if (!paddleWebhookSecret) {
  throw new Error('Paddle webhook secret is not set')
}

let paddle: Paddle
if (process.env.NODE_ENV === 'production') {
  paddle = new Paddle(paddleApiKey, options)
} else {
  if (!(global as any).paddle) {
    ;(global as any).paddle = new Paddle(paddleApiKey, options)
  }

  paddle = (global as any).paddle
}

export { paddle }
