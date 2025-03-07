import type React from 'react'

import { getTranslations, setRequestLocale } from 'next-intl/server'
import { MetadataManager } from '@/lib/metadata-manager'
import { Heading } from '@/components/heading'
import { routing } from '@/lib/i18n/routing'

import type { Metadata } from 'next'
import type { DynamicPageProps } from '@/types/page'
import { Fetch } from '@/lib/fetch'
import { Env } from '@/lib/env'
import { protectRoute } from '@/lib/auth/client/protect-route'
import { cookies } from 'next/headers'
import type { User } from '@/types/user'
import { CONSTANTS } from '@/lib/constants'

const UsagesPage: React.FC<DynamicPageProps> = async ({ params }: DynamicPageProps) => {
  const { locale } = await params
  setRequestLocale(locale)

  const token = protectRoute(await cookies(), locale) as string

  const response = await Fetch.get<{
    data: User
  }>(`${Env.appUrl}/api/user`, {
    authorization: `Bearer ${token}`
  })

  const json = await response.json()
  const user = json.data

  const credits = CONSTANTS.USAGES[user.plus ? 'PLUS' : 'NORMAL'].CREDITS
  const premium_credits = CONSTANTS.USAGES[user.plus ? 'PLUS' : 'NORMAL'].PREMIUM_CREDITS

  const t = await getTranslations('usages')
  return (
    <div className='flex size-full flex-col mt-4'>
      <Heading className='max-md:mt-0'>{t('text')}</Heading>

      <div className='grid gap-2'>
        <div className='grid gap-1'>
          <div className='flex items-center justify-between w-full'>
            <h1 className='font-bold text-lg'>{t('credits')}</h1>

            <span>
              {user.credits} / {credits}
            </span>
          </div>

          <div className='w-full h-4 bg-background-secondary rounded-full'>
            <div
              className='bg-accent-700 h-full rounded-full'
              style={{
                width: `${(user.credits / credits) * 100}%`
              }}
            />
          </div>
        </div>

        <div className='grid gap-1'>
          <div className='flex items-center justify-between w-full'>
            <h1 className='font-bold text-lg'>{t('premium-credits')}</h1>

            <span>
              {user.premiumCredits} / {premium_credits}
            </span>
          </div>

          <div className='w-full h-4 bg-background-secondary rounded-full'>
            <div
              className='bg-accent-700 h-full rounded-full'
              style={{
                width: `${(user.premiumCredits / premium_credits) * 100}%`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export const generateMetadata = async ({ params }: DynamicPageProps): Promise<Metadata> => {
  const { locale } = await params

  const t = await getTranslations({
    locale,
    namespace: 'usages'
  })
  return MetadataManager.generate(t('text'), t('description'))
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default UsagesPage
