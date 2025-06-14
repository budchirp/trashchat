import type React from 'react'

import { Container } from '@/components/container'

import { SettingsProfilePicture } from '@/components/settings/profile-picture'
import { SettingsLinksSection } from '@/components/settings/links-section'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { authenticatedRoute } from '@/lib/auth/client'
import { CreditCard, Crown } from 'lucide-react'
import { UserAPIManager } from '@/lib/api/user'
import { Button } from '@/components/button'
import { Link } from '@/lib/i18n/routing'
import { cookies } from 'next/headers'

import type { DynamicLayoutProps } from '@/types/layout'
import type { User } from '@/types/user'

const Layout: React.FC<DynamicLayoutProps> = async ({ children, params }: DynamicLayoutProps) => {
  const { locale } = await params
  setRequestLocale(locale)

  const token = authenticatedRoute(await cookies())
  const user = (await UserAPIManager.get({ token, locale })) as User

  const t = await getTranslations({
    locale
  })

  return (
    <Container className='flex flex-col md:flex-row'>
      <div className='md:w-1/4 w-full md:border-b-0 md:border-r-4 mt-16 border-border md:mr-4 md:pr-4 mb-4 md:mb-0 grid h-min gap-4'>
        <div className='flex items-center flex-col gap-2 justify-center'>
          <SettingsProfilePicture user={user} />
          <span className='text-center font-bold text-xl flex gap-2 items-center'>
            {user?.profile?.name}
          </span>

          {!user.subscription && (
            <Link href='/subscribe'>
              <Button className='flex gap-2 items-center'>
                <CreditCard size={16} />
                <span>{t('subscribe.text')}</span>
              </Button>
            </Link>
          )}
        </div>

        <SettingsLinksSection />
      </div>

      <div className='flex flex-col grow w-full'>{children}</div>
    </Container>
  )
}

export default Layout
