import type React from 'react'

import { VerticalPage } from '@/components/vertical-page'
import { MetadataManager } from '@/lib/metadata-manager'
import { routing } from '@/lib/i18n/routing'
import { Container } from '@/components/container'

import type { Metadata } from 'next'
import type { DynamicPageProps } from '@/types/page'

const NotFound: React.FC<DynamicPageProps> = async () => {
  return (
    <Container>
      <VerticalPage items={['Not', 'found']} title={'404'} />
    </Container>
  )
}

export const metadata: Metadata = MetadataManager.generate('Not found', '404')

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default NotFound
