'use client'

import type React from 'react'
import { memo, useMemo } from 'react'

import { Markdown, type MarkdownProps } from '@/components/markdown'
import { marked } from 'marked'

const MemoizedMarkdownBlock: React.MemoExoticComponent<(props: MarkdownProps) => React.ReactNode> =
  memo(
    ({ content }: MarkdownProps): React.ReactNode => {
      return <Markdown content={content} />
    },
    (prevProps, nextProps) => {
      if (prevProps.content !== nextProps.content) return false
      return true
    }
  )

const parseMarkdownIntoBlocks = (markdown: string): string[] => {
  const tokens = marked.lexer(markdown)
  return tokens.map((token) => token.raw)
}

export const MemoizedMarkdown: React.MemoExoticComponent<
  (props: MarkdownProps) => React.ReactNode
> = memo(({ content }: MarkdownProps): React.ReactNode => {
  const blocks = useMemo(() => parseMarkdownIntoBlocks(content), [content])
  return blocks.map((block, index) => (
    <MemoizedMarkdownBlock content={block} key={`block_${index}`} />
  ))
})
