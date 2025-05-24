import type React from 'react'

import { getTranslations, setRequestLocale } from 'next-intl/server'
import { MetadataManager } from '@/lib/metadata-manager'
import { authenticatedRoute } from '@/lib/auth/client'
import { UserAPIManager } from '@/lib/api/user'
import { Heading } from '@/components/heading'
import { routing } from '@/lib/i18n/routing'
import { CONSTANTS } from '@/lib/constants'
import { cookies } from 'next/headers'

import type { Metadata } from 'next'
import type { DynamicPageProps } from '@/types/page'
import type { User } from '@/types/user'

const UsagesPage: React.FC<DynamicPageProps> = async ({ params }: DynamicPageProps) => {
  const { locale } = await params
  setRequestLocale(locale)

  const token = authenticatedRoute(await cookies())

  const user = (await UserAPIManager.get({ token, locale })) as User

  const credits = user.isEmailVerified
    ? CONSTANTS.USAGES[user.subscription ? 'PLUS' : 'NORMAL'].CREDITS
    : 10
  const premium_credits = CONSTANTS.USAGES[user.subscription ? 'PLUS' : 'NORMAL'].PREMIUM_CREDITS

  const t = await getTranslations({
    namespace: 'settings.usages',
    locale
  })

  const resetDate = new Date(user.firstUsageAt || Date.now())
  resetDate.setDate(resetDate.getDate() + 10)

  return (
    <div className='flex size-full flex-col mt-4'>
      <Heading
        description={
          <div>
            {!user.isEmailVerified && <p>{t('verify-warning')}</p>}
            {user.firstUsageAt && user.isEmailVerified && (
              <p>{t('reset', { date: resetDate.toLocaleDateString() })}</p>
            )}
          </div>
        }
        className='max-md:mt-0'
      >
        {t('text')}
      </Heading>

      <div className='grid gap-4'>
        <div className='grid gap-1'>
          <div className='flex items-center justify-between w-full'>
            <h1 className='font-bold text-md'>{t('credits')}</h1>

            <span>
              {user.usages.credits} / {credits}
            </span>
          </div>

          <div className='w-full border border-border overflow-hidden h-4 bg-background-secondary rounded-full'>
            <div
              className='bg-background-accent-primary h-full rounded-full'
              style={{
                width: `${(user.usages.credits / credits) * 100}%`
              }}
            />
          </div>
        </div>

        <div className='grid gap-1'>
          <div className='flex items-center justify-between w-full'>
            <h1 className='font-bold text-md'>{t('premium-credits')}</h1>

            <span>
              {user.usages.premiumCredits} / {premium_credits}
            </span>
          </div>

          <div className='w-full border border-border overflow-hidden h-4 bg-background-secondary rounded-full'>
            <div
              className='bg-accent-700 h-full rounded-full'
              style={{
                width: `${premium_credits === 0 ? 0 : (user.usages.premiumCredits / premium_credits) * 100}%`
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
    namespace: 'settings.usages',
    locale
  })
  return MetadataManager.generate(t('text'), t('description'))
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default UsagesPage
