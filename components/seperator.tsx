import { cn } from '@/lib/cn'
import type { ComponentProps } from 'react'
import type React from 'react'

type SeperatorProps = {
  text?: React.ReactNode
} & ComponentProps<'div'>

export const Seperator: React.FC<SeperatorProps> = ({
  text,
  className,
  ...props
}: SeperatorProps): React.ReactNode => {
  return (
    <div className='relative flex items-center'>
      {text ? (
        <>
          <div className='flex-grow border-t-4 border-border' />
          <span
            {...props}
            className={cn('flex-shrink font-medium mx-4 my-2 text-text-tertiary', className)}
          >
            {text}
          </span>
          <div className='flex-grow border-t-4 border-border' />
        </>
      ) : (
        <div className='flex-grow border-t-4 border-border' />
      )}
    </div>
  )
}
