import type React from 'react'

import { AccountClientPage } from '@/app/[locale]/(main)/settings/(account)/page.client'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { protectRoute } from '@/lib/auth/client/protect-route'
import { MetadataManager } from '@/lib/metadata-manager'
import { Heading } from '@/components/heading'
import { UserAPIManager } from '@/lib/api/user'
import { cookies } from 'next/headers'
import { routing } from '@/lib/i18n/routing'

import type { Metadata } from 'next'
import type { DynamicPageProps } from '@/types/page'

import type { User } from '@/types/user'

const AccountPage: React.FC<DynamicPageProps> = async ({ params }: DynamicPageProps) => {
  const { locale } = await params
  setRequestLocale(locale)

  const token = protectRoute(await cookies(), locale) as string

  const user = (await UserAPIManager.get(token)) as User

  const t = await getTranslations({
    namespace: 'account',
    locale
  })

  return (
    <div className='flex size-full flex-col mt-4'>
      <Heading className='max-md:mt-0'>{t('text')}</Heading>

      <div>
        <AccountClientPage user={user} />
      </div>
    </div>
  )
}

export const generateMetadata = async ({ params }: DynamicPageProps): Promise<Metadata> => {
  const { locale } = await params

  const t = await getTranslations({
    namespace: 'account',
    locale
  })
  return MetadataManager.generate(t('text'), t('description'))
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default AccountPage
