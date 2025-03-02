import type React from 'react'

import { routing } from '@/lib/i18n/routing'
import { notFound } from 'next/navigation'
import { ThemeProvider } from '@/providers/theme'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { NextIntlClientProvider } from 'next-intl'
import { ToastProvider } from '@/providers/toast'
import { Env } from '@/lib/env'
import Script from 'next/script'

import type { Metadata } from 'next'
import type { DynamicLayoutProps } from '@/types/layout'

export const generateMetadata = async ({ params }: DynamicLayoutProps): Promise<Metadata> => {
  const { locale } = await params

  const t = await getTranslations({
    locale,
    namespace: 'landing'
  })
  return {
    description: t('description'),
    keywords: [''],
    title: {
      default: t('text'),
      template: `%s - ${Env.appName}`
    },
    twitter: {
      card: 'summary',
      creator: 'Can Kolay',
      description: t('description'),
      title: {
        default: t('text'),
        template: `%s - ${Env.appName}`
      }
    },
    openGraph: {
      siteName: Env.appName,
      locale: 'en_US',
      type: 'website',
      description: t('description'),
      url: Env.appUrl,
      countryName: 'Türkiye',
      title: {
        default: t('text'),
        template: `%s - ${Env.appName}`
      }
    }
  }
}

const Layout: React.FC<DynamicLayoutProps> = async ({ children, params }: DynamicLayoutProps) => {
  const { locale } = await params

  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  setRequestLocale(locale)

  const messages = await getMessages()
  return (
    <NextIntlClientProvider messages={messages}>
      <ThemeProvider>
        <ToastProvider>
          <div className='absolute inset-0 select-none overflow-hidden'>
            <div className='absolute z-0 top-[10%] left-[15%] size-96 opacity-25 bg-accent-500 rounded-full blur-[128px]' />
            <div className='absolute z-0 top-[35%] right-[20%] size-96 opacity-25 bg-accent-600 rounded-full blur-[128px]' />
            <div className='absolute z-0 top-[50%] left-[25%] size-96 opacity-25 bg-accent-800 rounded-full blur-[128px]' />
            <div className='absolute z-0 top-[80%] right-[10%] size-96 opacity-25 bg-accent-700 rounded-full blur-[128px]' />
          </div>

          <div className='grid gap-4 relative z-10 size-full'>{children}</div>

          <Script
            defer
            src='https://static.cloudflareinsights.com/beacon.min.js'
            data-cf-beacon={`{"token": "${process.env.CLOUDFLARE_TOKEN}"}`}
          />
        </ToastProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  )
}

export default Layout
