import type React from 'react'
import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'

import { cn } from '@/lib/cn'
import { Backdrop } from '@/components/backdrop'
import { DialogPanel, DialogTitle, Dialog as HeadlessDialog } from '@headlessui/react'
import { Container } from '@/components/container'
import { Box } from '@/components/box'
import { Button } from '@/components/button'
import { X } from 'lucide-react'

export type DialogProps = {
  title: React.ReactNode
  content: React.ReactNode
  open: boolean
  onClose: () => void
}

export const Dialog: React.FC<DialogProps> = ({
  title,
  content,
  open,
  onClose
}: DialogProps): React.ReactNode => {
  const [mounted, setMounted] = useState<boolean>(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <HeadlessDialog open={open} transition onClose={onClose}>
      {mounted &&
        createPortal(
          <Backdrop open={open} onClose={onClose} />,
          document.querySelector('#main') as Element
        )}

      <div className='w-screen h-screen_ flex justify-center items-center z-20 mx-auto inset-0 fixed'>
        <Container className='fixed top-20 flex h-min items-center justify-center'>
          <DialogPanel
            as={Box}
            transition
            variant='primary'
            className={cn(
              'top-0 grid w-full gap-2 md:max-w-96 overflow-hidden sm:max-w-(--breakpoint-xs)',
              'transition-all scale-100 opacity-100',
              'data-closed:scale-90 data-closed:opacity-0',
              'data-enter:ease-out data-enter:duration-400',
              'data-leave:ease-in data-leave:duration-200'
            )}
          >
            <div className='flex items-center justify-between'>
              <DialogTitle className='text-2xl font-bold'>{title}</DialogTitle>
              <Button onClick={onClose} variant='round' color='secondary'>
                <X />
              </Button>
            </div>

            {content}
          </DialogPanel>
        </Container>
      </div>
    </HeadlessDialog>
  )
}
Dialog.displayName = 'Dialog'
