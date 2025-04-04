'use client'

import type React from 'react'
import { useState } from 'react'

import { Button } from '@/components/button'
import { Box } from '@/components/box'
import { useTranslations } from 'next-intl'
import { toast } from '@/lib/toast'
import { Check, Clipboard } from 'lucide-react'
import { createJavaScriptRegexEngine } from 'shiki'
import { bundledLanguages, createHighlighter } from 'shiki/bundle/web'
import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight
} from '@shikijs/transformers'

import githubDarkDefault from '@shikijs/themes/github-dark-default'
import githubLightDefault from '@shikijs/themes/github-light-default'

const engine = createJavaScriptRegexEngine()

const shiki = await createHighlighter({
  themes: [githubDarkDefault, githubLightDefault],
  langs: Object.keys(bundledLanguages),
  engine
})

type MarkdownCodeProps = {
  children: React.ReactNode
  className: string
}

export const MarkdownCode: React.FC<MarkdownCodeProps> = ({
  children,
  className
}: MarkdownCodeProps): React.ReactNode => {
  const match = /language-(\w+)/.exec(className || '')
  if (match) {
    const lang = match[1]
    const code = String(children).replace(/\n$/, '')
    const html = shiki.codeToHtml(code, {
      lang: !Object.keys(bundledLanguages).includes(lang) ? 'plaintext' : lang,
      themes: {
        light: 'github-light-default',
        dark: 'github-dark-default'
      },
      transformers: [
        transformerNotationDiff(),
        transformerNotationHighlight(),
        transformerNotationFocus(),
        transformerNotationErrorLevel()
      ]
    })

    const t = useTranslations('common')

    const [copied, setCopied] = useState<boolean>(false)
    return (
      <Box padding='none' variant='primary' className='rounded-2xl'>
        <div className='py-2 select-none ps-4 pe-2 border-b gap-2 w-full flex items-center justify-between border-border'>
          <span className='font-medium text-text-primary'>{lang}</span>

          <Button
            variant='round'
            color='secondary'
            disabled={copied}
            onClick={() => {
              navigator.clipboard.writeText(code)

              toast(t('copied'))

              setCopied(true)
              setTimeout(() => {
                setCopied(false)
              }, 3 * 1000)
            }}
          >
            {copied ? <Check size={16} /> : <Clipboard size={16} />}
          </Button>
        </div>

        <div
          dangerouslySetInnerHTML={{
            __html: html
          }}
        />
      </Box>
    )
  }

  return <code>{children}</code>
}
