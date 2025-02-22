import { appUrl } from '@/data'
import { routes, routing } from '@/lib/i18n/routing'

import type { MetadataRoute } from 'next'

const sitemap = (): MetadataRoute.Sitemap =>
  routing.locales.flatMap((locale) =>
    routes.map(
      (route): MetadataRoute.Sitemap[0] =>
        ({
          url: `${appUrl}/${locale}${route}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 1
        }) as MetadataRoute.Sitemap[0]
    )
  )

export default sitemap
