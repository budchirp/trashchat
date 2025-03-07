'use client'

import type React from 'react'

import { VerticalPage } from '@/components/vertical-page'
import { Loader } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Container } from '@/components/container'

const Loading: React.FC = () => {
  const t = useTranslations('common')
  return (
    <Container>
      <VerticalPage items={t('loading').split(' ')} title={<Loader className='animate-spin' />} />
    </Container>
  )
}

export default Loading
