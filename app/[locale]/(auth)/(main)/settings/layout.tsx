import type React from 'react'

import { Container } from '@/components/container'

import { SettingsLinksSection } from '@/components/settings/links-section'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { authenticatedRoute } from '@/lib/auth/client'
import { UserAPIManager } from '@/lib/api/user'
import { cookies } from 'next/headers'
import { Crown } from 'lucide-react'
import Image from 'next/image'

import type { DynamicLayoutProps } from '@/types/layout'
import type { User } from '@/types/user'

const Layout: React.FC<DynamicLayoutProps> = async ({ children, params }: DynamicLayoutProps) => {
  const { locale } = await params
  setRequestLocale(locale)

  const token = authenticatedRoute(await cookies(), locale)
  const user = (await UserAPIManager.get(token)) as User

  const t = await getTranslations({
    namespace: 'settings.account',
    locale
  })

  return (
    <Container className='flex flex-col md:flex-row'>
      <div className='md:w-1/4 w-full md:border-b-0 md:border-r-4 mt-16 border-border md:mr-4 md:pr-4 mb-4 md:mb-0 grid h-min gap-4'>
        <div className='flex items-center flex-col gap-2 justify-center'>
          <Image
            height={128}
            width={128}
            className='size-32 object-cover overflow-hidden p-1 border-2 border-border-hover rounded-full'
            alt={t('profile-picture')}
            src={user.profilePicture || '/images/placeholder.png'}
          />

          <h1 className='font-bold text-xl flex gap-2 items-center'>
            {user.plus && <Crown size={16} className='text-text-accent-primary' />}

            <span>{user.name}</span>
          </h1>
        </div>

        <SettingsLinksSection />
      </div>

      <div className='flex flex-col grow w-full'>{children}</div>
    </Container>
  )
}

export default Layout
