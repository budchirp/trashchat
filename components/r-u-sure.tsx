import type React from 'react'

import { Dialog } from '@/components/dialog'
import { Button } from '@/components/button'
import { useTranslations } from 'next-intl'

type AreYouSureDialogProps = {
  title: React.ReactNode
  children: React.ReactNode

  style?: 'default' | 'danger'

  open: boolean
  onClose: () => void

  onSubmit: () => void
}

export const AreYouSureDialog: React.FC<AreYouSureDialogProps> = ({
  title,
  children,

  style = 'danger',

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
        <div className='grid gap-2'>
          <div>{children}</div>

          <div className='flex justify-end gap-2'>
            <Button color='secondary' onClick={onClose}>
              {t('cancel')}
            </Button>

            <Button
              color={style === 'danger' ? 'danger' : 'primary'}
              onClick={onSubmit}
              type='submit'
            >
              {t('submit')}
            </Button>
          </div>
        </div>
      }
    />
  )
}
