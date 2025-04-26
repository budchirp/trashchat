'use client'

import type React from 'react'
import { useState } from 'react'

import { Button } from '@/components/button'
import { Check, Clipboard } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { toast } from '@/components/toast'

type CopyButtonProps = {
  content: string
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  content
}: CopyButtonProps): React.ReactNode => {
  const [copied, setCopied] = useState<boolean>(false)

  const t = useTranslations('common')

  return (
    <Button
      variant='round'
      color='secondary'
      disabled={copied}
      onClick={() => {
        navigator.clipboard.writeText(content)

        toast(t('copied'))

        setCopied(true)
        setTimeout(() => {
          setCopied(false)
        }, 3 * 1000)
      }}
    >
      {copied ? <Check size={16} /> : <Clipboard size={16} />}
    </Button>
  )
}
