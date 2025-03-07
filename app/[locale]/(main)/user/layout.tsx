import type React from 'react'

import { Container } from '@/components/container'

import type { DynamicLayoutProps } from '@/types/layout'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { protectRoute } from '@/lib/auth/client/protect-route'
import { cookies } from 'next/headers'
import { Env } from '@/lib/env'
import { Fetch } from '@/lib/fetch'
import { Link } from '@/lib/i18n/routing'
import { Crown } from 'lucide-react'
import Image from 'next/image'

import type { User } from '@/types/user'
import type { RouteMap } from '@/types/route-map'

const Layout: React.FC<DynamicLayoutProps> = async ({ children, params }: DynamicLayoutProps) => {
  const { locale } = await params
  setRequestLocale(locale)

  const token = protectRoute(await cookies(), locale) as string

  const response = await Fetch.get<{ data: User }>(`${Env.appUrl}/api/user`, {
    authorization: `Bearer ${token}`
  })

  const json = await response.json()
  const user = json.data

  const t = await getTranslations({
    locale,
    namespace: 'profile'
  })

  const t_all = await getTranslations({
    locale
  })

  const routes: RouteMap = [
    {
      location: '/',
      title: t_all('profile.text')
    },
    {
      location: '/usages',
      title: t_all('usages.text')
    }
  ]

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
            <h1 className='font-bold text-lg flex gap-1 items-center'>
              {user.plus && <Crown size={16} className='text-amber-500' />}

              <span>{user.name}</span>
            </h1>

            <h2 className='font-medium'>{user.username}</h2>
          </div>

          <div className='grid'>
            {routes.map((route) => {
              return (
                <Link
                  href={`/user${route.location}`}
                  className='font-bold text-text-primary text-lg'
                  key={route.location}
                >
                  {route.title}
                </Link>
              )
            })}
          </div>
        </div>

        <div className='flex flex-col grow w-full'>{children}</div>
      </div>
    </Container>
  )
}

export default Layout
