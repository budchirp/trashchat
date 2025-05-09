'use client'

import type React from 'react'
import { useState } from 'react'

import { Check, Clipboard } from 'lucide-react'
import { Button } from '@/components/button'
import { useTranslations } from 'next-intl'
import { toast } from '@/components/toast'

type CopyButtonProps = {
  variant?: 'big' | 'small'
  content: string
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  variant = 'big',
  content
}: CopyButtonProps): React.ReactNode => {
  const [copied, setCopied] = useState<boolean>(false)

  const t = useTranslations('common')

  const Icon = copied ? <Check size={16} /> : <Clipboard size={16} />

  const copy = () => {
    navigator.clipboard.writeText(content)

    toast(t('copied'))

    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 3 * 1000)
  }

  return variant === 'big' ? (
    <Button variant='round' color='secondary' disabled={copied} onClick={copy}>
      {Icon}
    </Button>
  ) : (
    <button type='button' disabled={copied} onClick={copy}>
      {Icon}
    </button>
  )
}
