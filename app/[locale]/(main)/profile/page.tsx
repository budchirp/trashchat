import type React from 'react'

import { getTranslations, setRequestLocale } from 'next-intl/server'
import { MetadataManager } from '@/lib/metadata-manager'
import { Heading } from '@/components/heading'
import { Button } from '@/components/button'
import { Fetch } from '@/lib/fetch'
import { protectRoute } from '@/lib/auth/client/protect-route'
import { cookies } from 'next/headers'
import { Env } from '@/lib/env'
import { routing } from '@/lib/i18n/routing'

import type { Metadata } from 'next'
import type { DynamicPageProps } from '@/types/page'

import type { User } from '@/types/user'

const ProfilePage: React.FC<DynamicPageProps> = async ({ params }: DynamicPageProps) => {
  const { locale } = await params
  setRequestLocale(locale)

  const token = protectRoute(await cookies(), locale) as string

  const response = await Fetch.get<{ data: User }>(`${Env.appUrl}/api/user`, {
    authorization: `Bearer ${token}`
  })

  const json = await response.json()
  const user = json.data

  const t = await getTranslations('profile')
  return (
    <div className='flex size-full flex-col mt-4'>
      <Heading>{t('text')}</Heading>

      <div className='grid gap-4'>
        <div>
          <h1 className='font-bold text-lg'>{user.name}</h1>

          <h2 className='font-medium'>{user.username}</h2>
        </div>

        <div>
          <Button>{t('delete')}</Button>
        </div>
      </div>
    </div>
  )
}

export const generateMetadata = async ({ params }: DynamicPageProps): Promise<Metadata> => {
  const { locale } = await params

  const t = await getTranslations({
    locale,
    namespace: 'profile'
  })
  return MetadataManager.generate(t('text'), t('description'))
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default ProfilePage
