import type React from 'react'

import { Container } from '@/components/container'

import { SettingsSection } from '@/app/[locale]/(main)/settings/layout.client'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { protectRoute } from '@/lib/auth/client/protect-route'
import { UserAPIManager } from '@/lib/api/user'
import { cookies } from 'next/headers'
import { Crown } from 'lucide-react'
import Image from 'next/image'

import type { DynamicLayoutProps } from '@/types/layout'
import type { User } from '@/types/user'

const Layout: React.FC<DynamicLayoutProps> = async ({ children, params }: DynamicLayoutProps) => {
  const { locale } = await params
  setRequestLocale(locale)

  const token = protectRoute(await cookies(), locale) as string

  const user = (await UserAPIManager.get(token)) as User

  const t = await getTranslations({
    namespace: 'account',
    locale
  })

  return (
    <Container>
      <div className='flex flex-col md:flex-row w-full'>
        <div className='md:w-1/4 w-full md:border-b-0 md:border-r-4 mt-16 border-border md:mr-4 md:pr-4 mb-4 md:mb-0 grid h-min gap-4'>
          <div className='size-32 mx-auto p-2 rounded-full border border-border-hover flex items-center justify-center'>
            <Image
              height={128}
              width={128}
              className='size-full rounded-full'
              alt={t('profile-picture')}
              src={user.profilePicure || '/images/placeholder.png'}
            />
          </div>

          <div>
            <h1 className='font-bold text-xl flex gap-2 items-center'>
              {user.plus && <Crown size={16} className='text-text-accent-primary' />}

              <span>{user.name}</span>
            </h1>

            <h2 className='font-medium text-text-tertiary'>{user.username}</h2>
          </div>

          <SettingsSection />
        </div>

        <div className='flex flex-col grow w-full'>{children}</div>
      </div>
    </Container>
  )
}

export default Layout
