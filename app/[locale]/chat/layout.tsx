import type React from 'react'

import { Header } from '@/components/ui/header'
import { Sidebar } from '@/components/ui/sidebar'
import { protectRoute } from '@/lib/auth/client/protect-route'
import { setRequestLocale } from 'next-intl/server'
import { cookies } from 'next/headers'

import type { DynamicLayoutProps } from '@/types/layout'

const Layout: React.FC<DynamicLayoutProps> = async ({ children, params }: DynamicLayoutProps) => {
  const { locale } = await params
  setRequestLocale(locale)

  protectRoute(await cookies(), locale)

  return (
    <div className='flex size-full'>
      <div className='w-1/4 hidden md:block h-screen relative'>
        <Sidebar />
      </div>

      <div className='w-full md:w-3/4 flex flex-col grow h-full relative'>
        <Header sidebar />

        <main id='main' className='w-full page-min-h-screen'>
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
