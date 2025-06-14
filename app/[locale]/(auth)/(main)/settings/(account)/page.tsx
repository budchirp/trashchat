import type React from 'react'

import { getTranslations, setRequestLocale } from 'next-intl/server'
import { MetadataManager } from '@/lib/metadata-manager'
import { authenticatedRoute } from '@/lib/auth/client'
import { AccountClientPage } from './page.client'
import { Heading } from '@/components/heading'
import { routing } from '@/lib/i18n/routing'
import { cookies } from 'next/headers'

import type { Metadata } from 'next'
import type { DynamicPageProps } from '@/types/page'
import { UserAPIManager } from '@/lib/api/user'
import { ResendVerificationEmailButton } from '../../auth/verify/email/[token]/resend-button'

const AccountPage: React.FC<DynamicPageProps> = async ({ params }: DynamicPageProps) => {
  const { locale } = await params
  setRequestLocale(locale)

  const token = authenticatedRoute(await cookies())

  const user = await UserAPIManager.get({ token, locale })

  const t = await getTranslations({
    namespace: 'settings.account',
    locale
  })

  return (
    <div className='flex size-full flex-col mt-4'>
      <Heading
        description={
          !user?.isEmailVerified && (
            <div className='grid gap-2'>
              <p>{t('verify-warning')}</p>

              <div>
                <ResendVerificationEmailButton />
              </div>
            </div>
          )
        }
        className='max-md:mt-0'
      >
        {t('text')}
      </Heading>

      <AccountClientPage />
    </div>
  )
}

export const generateMetadata = async ({ params }: DynamicPageProps): Promise<Metadata> => {
  const { locale } = await params

  const t = await getTranslations({
    namespace: 'settings.account',
    locale
  })
  return MetadataManager.generate(t('text'), t('description'))
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default AccountPage
