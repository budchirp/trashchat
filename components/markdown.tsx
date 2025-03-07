import type React from 'react'
import { memo, useMemo, useState } from 'react'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { marked } from 'marked'
import { Button } from '@/components/button'
import { Box } from '@/components/box'
import { useTranslations } from 'next-intl'
import { toast } from '@/lib/toast'
import { Check, Clipboard } from 'lucide-react'
import { bundledLanguages, createHighlighter } from 'shiki/bundle/web'
import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight
} from '@shikijs/transformers'

import githubDarkDefault from '@shikijs/themes/github-dark-default'
import githubLightDefault from '@shikijs/themes/github-light-default'

function parseMarkdownIntoBlocks(markdown: string): string[] {
  const tokens = marked.lexer(markdown)
  return tokens.map((token) => token.raw)
}

export type MemoizedMarkdownProps = {
  content: string
}

const shiki = await createHighlighter({
  themes: [githubDarkDefault, githubLightDefault],
  langs: Object.keys(bundledLanguages)
})

const MemoizedMarkdownBlock: React.MemoExoticComponent<
  (props: MemoizedMarkdownProps) => React.ReactNode
> = memo(
  ({ content }: MemoizedMarkdownProps): React.ReactNode => {
    return (
      <ReactMarkdown
        components={{
          code: ({ children, className }) => {
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
        }}
        remarkPlugins={[remarkGfm]}
      >
        {content}
      </ReactMarkdown>
    )
  },
  (prevProps, nextProps) => {
    if (prevProps.content !== nextProps.content) return false
    return true
  }
)
MemoizedMarkdownBlock.displayName = 'MemoizedMarkdownBlock'

export const MemoizedMarkdown: React.MemoExoticComponent<
  (props: MemoizedMarkdownProps) => React.ReactNode
> = memo(({ content }: MemoizedMarkdownProps): React.ReactNode => {
  const blocks = useMemo(() => parseMarkdownIntoBlocks(content), [content])

  return blocks.map((block, index) => (
    <MemoizedMarkdownBlock content={block} key={`block_${index}`} />
  ))
})
MemoizedMarkdown.displayName = 'MemoizedMarkdown'
