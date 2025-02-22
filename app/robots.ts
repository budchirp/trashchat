import { appUrl } from '@/data'

import type { MetadataRoute } from 'next'

const robots = (): MetadataRoute.Robots => {
  return {
    rules: {
      userAgent: '*',
      allow: '/'
    },
    sitemap: `${appUrl}/sitemap.xml`
  }
}

export default robots
