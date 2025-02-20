import type React from 'react'
import { memo, useMemo } from 'react'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { marked } from 'marked'

function parseMarkdownIntoBlocks(markdown: string): string[] {
  const tokens = marked.lexer(markdown)
  return tokens.map((token) => token.raw)
}

export type MemoizedMarkdownProps = {
  content: string
}

const MemoizedMarkdownBlock: React.MemoExoticComponent<
  (props: MemoizedMarkdownProps) => React.ReactNode
> = memo(
  ({ content }: MemoizedMarkdownProps): React.ReactNode => {
    return <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
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
