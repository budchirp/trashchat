import type React from 'react'
import type { ComponentProps } from 'react'

import { CopyButton } from '@/components/markdown/code/copy-button'
import { isInlineCode, useShikiHighlighter } from 'react-shiki'
import { Box } from '@/components/box'
import { cn } from '@/lib/cn'

import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight
} from '@shikijs/transformers'

type MarkdownCodeProps = {
  node: any
} & ComponentProps<'code'>

export const MarkdownCode: React.FC<MarkdownCodeProps> = ({
  children,
  className,
  node
}: MarkdownCodeProps): React.ReactNode => {
  const code = String(children).trim()

  const match = className?.match(/language-(\w+)/)
  const lang = match?.[1] || 'plaintext'

  const isInline = node ? isInlineCode(node) : undefined
  if (!isInline) {
    const highlighted = useShikiHighlighter(
      code,
      lang,
      {
        light: 'github-light-default',
        dark: 'github-dark-default'
      },
      {
        delay: 150,
        transformers: [
          transformerNotationDiff(),
          transformerNotationErrorLevel(),
          transformerNotationFocus(),
          transformerNotationHighlight()
        ]
      }
    )

    return (
      <Box padding='none' variant='primary'>
        <div className='py-2 select-none ps-4 pe-2 border-b gap-2 w-full flex items-center justify-between border-border'>
          <span className='font-medium text-text-primary'>{lang}</span>

          <CopyButton content={code} />
        </div>

        <div className={cn('select-text rounded-3xl w-full min-w-0', !highlighted && 'px-4 py-2')}>
          {highlighted ?? (
            <div className='w-full h-2 bg-background-tertiary rounded-lg animate-pulse' />
          )}
        </div>
      </Box>
    )
  }

  return <code>{code}</code>
}
