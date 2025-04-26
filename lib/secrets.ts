import 'server-only'

export const Secrets = {
  appSecret: process.env.APP_SECRET || 'something safe',

  cloudflareToken: process.env.CLOUDFLARE_TOKEN || '',

  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID || null,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || null,

  S3Bucket: process.env.S3_BUCKET || null,

  resendApiKey: process.env.RESEND_TOKEN || null,

  captchaSiteKey: process.env.CAPTCHA_SITE_KEY || null,
  captchaSecretKey: process.env.CAPTCHA_SECRET_KEY || null
}
