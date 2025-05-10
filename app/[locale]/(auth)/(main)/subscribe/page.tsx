import type React from 'react'

import { getTranslations, setRequestLocale } from 'next-intl/server'
import { MetadataManager } from '@/lib/metadata-manager'
import { Link, routing } from '@/lib/i18n/routing'
import { Heading } from '@/components/heading'
import { Button } from '@/components/button'
import { CONSTANTS } from '@/lib/constants'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/cn'

import type { Metadata } from 'next'
import type { DynamicPageProps } from '@/types/page'

const tiers = ['Normal', 'Plus'] as const
const features = [
  'basic-models',
  'plus-models',
  'premium-models',
  'image-file-upload',
  'image-generation',
  'search',
  'reasoning',
  'normal-model-limit',
  'premium-model-limit'
] as const

const featureMap: Record<(typeof tiers)[number], (typeof features)[number][]> = {
  Normal: ['basic-models', 'normal-model-limit', 'premium-model-limit'],
  Plus: [
    'basic-models',
    'plus-models',
    'premium-models',
    'normal-model-limit',
    'premium-model-limit',
    'image-file-upload',
    'image-generation',
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
    'plus-models': t('features.plus-models'),
    'premium-models': t('features.premium-models'),
    'normal-model-limit': t('features.normal-model-limit'),
    'premium-model-limit': t('features.premium-model-limit'),
    'image-file-upload': t('features.image-file-upload'),
    'image-generation': t('features.image-generation'),
    search: t('features.search'),
    reasoning: t('features.reasoning')
  } as const
}

const SubscribePage: React.FC<DynamicPageProps> = async ({ params }: DynamicPageProps) => {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({
    namespace: 'subscribe',
    locale
  })

  const translatedTitles = titles(t)

  const thClass = 'px-4 py-2 text-left font-bold text-text-tertiary tracking-wider'
  const tdClass = 'px-4 py-2 whitespace-nowrap font-medium text-gray-900 dark:text-white'

  return (
    <div className='flex size-full flex-col mt-4'>
      <Heading>{t('text')}</Heading>

      <div className='grid gap-4'>
        <table className='min-w-full'>
          <thead className='bg-background-primary'>
            <tr>
              <th scope='col' className={cn(thClass, 'w-full')} />

              {tiers.map((tier) => (
                <th key={tier} scope='col' className={cn(thClass, 'px-16')}>
                  {tier}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {features.map((feature) => (
              <tr className='bg-background-primary odd:bg-background-secondary' key={feature}>
                <td className={cn(tdClass, 'w-full')}>{translatedTitles[feature]}</td>

                {tiers.map((tier) => (
                  <td key={`${tier}-${feature}`} className={cn(tdClass, 'px-16')}>
                    {feature === 'normal-model-limit' ? (
                      tier === 'Normal' ? (
                        CONSTANTS.USAGES.NORMAL.CREDITS
                      ) : (
                        CONSTANTS.USAGES.PLUS.CREDITS
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
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div className='flex w-full items-center justify-center'>
          <Link href='/subscribe/payment'>
            <Button>
              {t('price', {
                price: CONSTANTS.PLUS_PRICE
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
