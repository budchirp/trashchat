import type React from 'react'

import { Dialog } from '@/components/dialog'
import { Button } from '@/components/button'
import { useTranslations } from 'next-intl'

type AreYouSureDialogProps = {
  title: React.ReactNode
  children: React.ReactNode
  open: boolean
  onClose: () => void
  onSubmit: () => void
}

export const AreYouSureDialog: React.FC<AreYouSureDialogProps> = ({
  title,
  children,
  open,
  onClose,
  onSubmit
}: AreYouSureDialogProps): React.ReactNode => {
  const t = useTranslations('common')

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      content={
        <div className='grid gap-4'>
          <div>{children}</div>

          <div className='flex gap-2'>
            <Button color='danger' onClick={onSubmit} type='submit'>
              {t('submit')}
            </Button>

            <Button onClick={onClose}>{t('cancel')}</Button>
          </div>
        </div>
      }
    />
  )
}
