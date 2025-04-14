export const Env = {
  appName: 'Trash Chat',
  appUrl: process.env.APP_URL || '',

  enabledProviders: ['google', 'azure'],

  appSecret: process.env.APP_SECRET || 'something safe',

  cloudflareToken: process.env.CLOUDFLARE_TOKEN || '',

  geminiApiKey: process.env.GEMINI_API_KEY || null,

  azureResourceName: process.env.AZURE_RESOURCE_NAME || null,
  azureApiKey: process.env.AZURE_API_KEY || null
}
