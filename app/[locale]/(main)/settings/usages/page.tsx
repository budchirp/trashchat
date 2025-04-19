import type React from 'react'

import { getTranslations, setRequestLocale } from 'next-intl/server'
import { MetadataManager } from '@/lib/metadata-manager'
import { Heading } from '@/components/heading'
import { routing } from '@/lib/i18n/routing'
import { protectRoute } from '@/lib/auth/client/protect-route'
import { cookies } from 'next/headers'
import { UserAPIManager } from '@/lib/api/user'
import { CONSTANTS } from '@/lib/constants'

import type { Metadata } from 'next'
import type { DynamicPageProps } from '@/types/page'
import type { User } from '@/types/user'

const UsagesPage: React.FC<DynamicPageProps> = async ({ params }: DynamicPageProps) => {
  const { locale } = await params
  setRequestLocale(locale)

  const token = protectRoute(await cookies(), locale) as string

  const user = (await UserAPIManager.get(token)) as User

  const credits = CONSTANTS.USAGES[user.plus ? 'PLUS' : 'NORMAL'].CREDITS
  const premium_credits = CONSTANTS.USAGES[user.plus ? 'PLUS' : 'NORMAL'].PREMIUM_CREDITS

  const t = await getTranslations({
    namespace: 'usages',
    locale
  })

  const resetDate = new Date(user.firstUsage || Date.now())
  resetDate.setDate(resetDate.getDate() + 10)

  return (
    <div className='flex size-full flex-col mt-4'>
      <Heading
        description={
          user.firstUsage && <p>{t('reset', { date: resetDate.toLocaleDateString() })}</p>
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
              {user.credits} / {credits}
            </span>
          </div>

          <div className='w-full border border-border h-4 bg-background-secondary rounded-full'>
            <div
              className='bg-background-accent-primary h-full rounded-full'
              style={{
                width: `${(user.credits / credits) * 100}%`
              }}
            />
          </div>
        </div>

        <div className='grid gap-1'>
          <div className='flex items-center justify-between w-full'>
            <h1 className='font-bold text-md'>{t('premium-credits')}</h1>

            <span>
              {user.premiumCredits} / {premium_credits}
            </span>
          </div>

          <div className='w-full border border-border h-4 bg-background-secondary rounded-full'>
            <div
              className='bg-accent-700 h-full rounded-full'
              style={{
                width: `${premium_credits === 0 ? 0 : (user.premiumCredits / premium_credits) * 100}%`
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
    namespace: 'usages',
    locale
  })
  return MetadataManager.generate(t('text'), t('description'))
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default UsagesPage
