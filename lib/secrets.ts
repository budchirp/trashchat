import 'server-only'

export const Secrets = {
  appSecret: process.env.APP_SECRET || 'something safe',

  coinbaseWebhookSecret: process.env.COINBASE_WEBHOOK_SECRET || null,
  coinbaseApiKey: process.env.COINBASE_API_KEY || null,

  databaseUrl: process.env.DATABASE_URL || '',

  cloudflareToken: process.env.CLOUDFLARE_TOKEN || '',

  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID || null,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || null,

  S3Bucket: process.env.S3_BUCKET || null,

  resendApiKey: process.env.RESEND_TOKEN || null,

  captchaSiteKey: process.env.CAPTCHA_SITE_KEY || null,
  captchaSecretKey: process.env.CAPTCHA_SECRET_KEY || null,

  openaiApiKey: process.env.OPENAI_API_KEY || null,

  googleVertexEmail: process.env.GOOGLE_VERTEX_EMAIL || null,
  googleVertexKey: process.env.GOOGLE_VERTEX_KEY || null,

  azureResourceName: process.env.AZURE_RESOURCE_NAME || null,
  azureApiKey: process.env.AZURE_API_KEY || null
}
