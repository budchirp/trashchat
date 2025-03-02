import type React from 'react'

import { Header } from '@/components/ui/header'
import { Footer } from '@/components/ui/footer'

import type { LayoutProps } from '@/types/layout'

const Layout: React.FC<LayoutProps> = async ({ children }: LayoutProps) => {
  return (
    <>
      <div className='flex flex-col size-full'>
        <Header />

        <main id='main' className='w-full page-min-h-screen'>
          {children}
        </main>
      </div>

      <Footer />
    </>
  )
}

export default Layout
