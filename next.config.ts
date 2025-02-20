import createNextIntlPlugin from 'next-intl/plugin'

import type { NextConfig } from 'next'

const withNextIntl = createNextIntlPlugin('./lib/i18n/request.ts')
const config = withNextIntl({
  reactStrictMode: true
} as NextConfig)

export default config
