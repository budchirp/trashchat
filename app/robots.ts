import { Env } from '@/lib/env'

import type { MetadataRoute } from 'next'

const robots = (): MetadataRoute.Robots => {
  return {
    rules: {
      userAgent: '*',
      allow: '/'
    },
    sitemap: `${Env.appUrl}/sitemap.xml`
  }
}

export default robots
