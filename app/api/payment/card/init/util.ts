import { createHmac } from 'crypto'
import { Secrets } from '@/lib/secrets'

export const generateIyzicoHeaders = (
  uriPath: string,
  payload: Record<string, any>
): Record<string, string> => {
  const randomKey = `${new Date().getTime()}123456789`

  const hmac = createHmac('sha256', Secrets.iyzicoSecretKey!)
  hmac.update(randomKey + uriPath + JSON.stringify(payload))
  const signature = hmac.digest('hex')

  const base64 = Buffer.from(
    `apiKey:${Secrets.iyzicoApiKey}&randomKey:${randomKey}&signature:${signature}`,
    'utf8'
  ).toString('base64')

  return {
    Authorization: `IYZWSv2 ${base64}`,
    'x-iyzi-rnd': randomKey,
    Accept: 'application/json'
  }
}
