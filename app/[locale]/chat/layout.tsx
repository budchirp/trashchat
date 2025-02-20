import type React from 'react'

import { Header } from '@/components/ui/header'

import type { LayoutProps } from '@/types/layout'

const Layout: React.FC<LayoutProps> = async ({ children }: LayoutProps) => {
  return (
    <div className='flex flex-col size-full'>
      <Header />

      <div className='w-full page-min-h-screen'>
        <main id="main" className='size-full'>{children}</main>
      </div>
    </div>
  )
}

export default Layout
