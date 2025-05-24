import { createNavigation } from 'next-intl/navigation'
import { defineRouting } from 'next-intl/routing'

export const routes = [
  '/',
  '/chat',
  '/auth/signin',
  '/auth/signup',
  '/legal/privacy-policy',
  '/legal/terms-of-service',
  '/subscribe',
  '/settings',
  '/settings/security',
  '/settings/usages',
  '/settings/customization',
  '/settings/appearance'
]

export const routing = defineRouting({
  locales: ['en', 'tr'],
  defaultLocale: 'en'
})

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
