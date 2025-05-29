import 'server-only'

import { Secrets } from '@/lib/secrets'
import { Resend } from 'resend'

const resendApiKey = Secrets.resendApiKey
if (!resendApiKey) {
  throw new Error('Resend API key is not set')
}

export const resend = new Resend(resendApiKey)
