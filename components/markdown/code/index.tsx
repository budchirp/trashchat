import type React from 'react'

import { CopyButton } from '@/components/markdown/code/copy-button'
import { Box } from '@/components/box'

import { bundledLanguages, createHighlighter } from 'shiki/bundle/web'
import { createJavaScriptRegexEngine } from 'shiki'
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

    return (
      <Box padding='none' variant='primary'>
        <div className='py-2 select-none ps-4 pe-2 border-b gap-2 w-full flex items-center justify-between border-border'>
          <span className='font-medium text-text-primary'>{lang}</span>

          <CopyButton content={code} />
        </div>

        <div
          className='select-text rounded-3xl'
          dangerouslySetInnerHTML={{
            __html: html
          }}
        />
      </Box>
    )
  }

  return <code>{children}</code>
}
