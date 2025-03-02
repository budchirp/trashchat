import type React from 'react'

import { Header } from '@/components/ui/header'
import { Sidebar } from '@/components/ui/sidebar'

import type { LayoutProps } from '@/types/layout'

const Layout: React.FC<LayoutProps> = async ({ children }: LayoutProps) => {
  return (
    <div className='flex size-full'>
      <div className='w-1/4 h-screen relative'>
        <Sidebar />
      </div>

      <div className='w-3/4 flex flex-col grow h-full relative'>
        <Header sidebar />

        <main id='main' className='w-full page-min-h-screen'>
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
