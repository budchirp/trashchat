import type React from 'react'

import { getTranslations, setRequestLocale } from 'next-intl/server'
import { MetadataManager } from '@/lib/metadata-manager'
import { authenticatedRoute, getToken } from '@/lib/auth/client'
import { Link, redirect, routing } from '@/lib/i18n/routing'
import { Heading } from '@/components/heading'
import { Button } from '@/components/button'
import { CONSTANTS } from '@/lib/constants'
import { Check, X } from 'lucide-react'
import { Box } from '@/components/box'
import { cookies } from 'next/headers'

import type { Metadata } from 'next'
import type { DynamicPageProps } from '@/types/page'
import { UserAPIManager } from '@/lib/api/user'

const tiers = ['Plus', 'Normal'] as const
const features = [
  'basic-models',
  'premium-models',
  'image-file-upload',
  'search',
  'reasoning',
  'normal-model-limit',
  'premium-model-limit'
] as const

const featureMap: Record<(typeof tiers)[number], (typeof features)[number][]> = {
  Normal: ['basic-models', 'normal-model-limit', 'premium-model-limit'],
  Plus: [
    'basic-models',
    'premium-models',
    'normal-model-limit',
    'premium-model-limit',
    'image-file-upload',
    'search',
    'reasoning'
  ]
} as const

const titles = (
  t: (key: string) => string
): {
  [key in (typeof features)[number]]: string
} => {
  return {
    'basic-models': t('features.basic-models'),
    'premium-models': t('features.premium-models'),
    'normal-model-limit': t('features.normal-model-limit'),
    'premium-model-limit': t('features.premium-model-limit'),
    'image-file-upload': t('features.image-file-upload'),
    search: t('features.search'),
    reasoning: t('features.reasoning')
  } as const
}

const SubscribePage: React.FC<DynamicPageProps> = async ({ params }: DynamicPageProps) => {
  const { locale } = await params
  setRequestLocale(locale)

  const token = getToken(await cookies())
  if (token) {
    const user = await UserAPIManager.get({ token, locale })
    if (user?.subscription)
      redirect({
        href: '/',
        locale
      })
  }

  const t = await getTranslations({
    namespace: 'subscribe',
    locale
  })

  const translatedTitles = titles(t)

  return (
    <div className='flex size-full flex-col mt-4'>
      <Heading>{t('text')}</Heading>

      <div className='grid gap-4'>
        <div className='grid justify-items-center grid-cols-1 md:grid-cols-2 gap-4'>
          {tiers.map((tier) => (
            <Box variant='blurry' className='p-4 grid max-w-sm gap-4' key={tier}>
              <div className='flex justify-center items-center flex-col gap-2'>
                <h2 className='font-semibold text-text-tertiary'>{tier}</h2>
                <h1 className='text-2xl font-bold text-text-accent-primary'>
                  {tier === 'Plus'
                    ? t('price', {
                        price: CONSTANTS.PLUS_PRICE
                      })
                    : t('free')}
                </h1>
              </div>

              <div className='grid gap-2'>
                {features.map((feature) => (
                  <div className='flex w-full items-center justify-between gap-2' key={feature}>
                    <h3 className='font-medium text-text-secondary'>{translatedTitles[feature]}</h3>
                    <div>
                      {feature === 'normal-model-limit' ? (
                        tier === 'Plus' ? (
                          CONSTANTS.USAGES.PLUS.CREDITS
                        ) : (
                          CONSTANTS.USAGES.NORMAL.CREDITS
                        )
                      ) : feature === 'premium-model-limit' ? (
                        tier === 'Plus' ? (
                          CONSTANTS.USAGES.PLUS.PREMIUM_CREDITS
                        ) : (
                          CONSTANTS.USAGES.NORMAL.PREMIUM_CREDITS
                        )
                      ) : featureMap[tier].includes(feature) ? (
                        <Check className='text-green-500' size={16} />
                      ) : (
                        <X className='text-red-500' size={16} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Box>
          ))}
        </div>

        <div className='flex w-full items-center justify-center'>
          <Link href='/subscribe/payment'>
            <Button>
              {t('subscribe', {
                price: t('price', {
                  price: CONSTANTS.PLUS_PRICE
                })
              })}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export const generateMetadata = async ({ params }: DynamicPageProps): Promise<Metadata> => {
  const { locale } = await params

  const t = await getTranslations({
    namespace: 'subscribe',
    locale
  })
  return MetadataManager.generate(t('text'), t('description'))
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default SubscribePage
