import type React from 'react'

import { CustomizationClientPage } from '@/app/[locale]/(main)/settings/customization/page.client'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { MetadataManager } from '@/lib/metadata-manager'
import { Heading } from '@/components/heading'
import { routing } from '@/lib/i18n/routing'

import type { Metadata } from 'next'
import type { DynamicPageProps } from '@/types/page'
import { protectRoute } from '@/lib/auth/client/protect-route'
import { cookies } from 'next/headers'
import type { User } from '@/types/user'
import { UserAPIManager } from '@/lib/user'

const CustomizationPage: React.FC<DynamicPageProps> = async ({ params }: DynamicPageProps) => {
  const { locale } = await params
  setRequestLocale(locale)

  const token = protectRoute(await cookies(), locale) as string

  const user = (await UserAPIManager.get(token)) as User

  const t = await getTranslations({
    namespace: 'customization',
    locale
  })

  return (
    <div className='flex size-full flex-col mt-4'>
      <Heading className='max-md:mt-0'>{t('text')}</Heading>

      <div>
        <CustomizationClientPage user={user} />
      </div>
    </div>
  )
}

export const generateMetadata = async ({ params }: DynamicPageProps): Promise<Metadata> => {
  const { locale } = await params

  const t = await getTranslations({
    namespace: 'customization',
    locale
  })
  return MetadataManager.generate(t('text'), t('description'))
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default CustomizationPage
