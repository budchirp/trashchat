import type React from 'react'
import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'

import { DialogPanel, DialogTitle, Dialog as HeadlessDialog } from '@headlessui/react'
import { Container } from '@/components/container'
import { Backdrop } from '@/components/backdrop'
import { Button } from '@/components/button'
import { Box } from '@/components/box'
import { Nav } from '@/components/nav'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'

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
          <Backdrop className='!z-40' open={open} onClose={onClose} />,
          document.body as Element
        )}

      <div className='w-screen h-screen_ flex justify-center items-center z-50 mx-auto inset-0 fixed'>
        <Container className='fixed top-20 flex h-full items-center justify-center'>
          <DialogPanel
            as={Box}
            transition
            variant='primary'
            padding='none'
            className={cn(
              'top-0 w-full max-h-3/4 absolute md:max-w-96 sm:max-w-(--breakpoint-xs) overflow-y-auto',
              'transition-all scale-100 opacity-100',
              'data-closed:scale-90 data-closed:opacity-0',
              'data-enter:ease-out data-enter:duration-400',
              'data-leave:ease-in data-leave:duration-200'
            )}
          >
            <Nav rounded container={false}>
              <DialogTitle className='text-2xl font-bold'>{title}</DialogTitle>
              <Button onClick={onClose} variant='round' color='secondary'>
                <X />
              </Button>
            </Nav>

            <div className='h-full p-4'>{content}</div>
          </DialogPanel>
        </Container>
      </div>
    </HeadlessDialog>
  )
}
