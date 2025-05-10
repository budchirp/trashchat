'use client'

import type React from 'react'
import { useRef, useState } from 'react'

import { buttonVariants } from '@/components/button'
import { CookieMonster } from '@/lib/cookie-monster'
import { useUpload } from '@/lib/helpers/use-upload'
import { UserAPIManager } from '@/lib/api/user'
import { useRouter } from '@/lib/i18n/routing'
import { useTranslations } from 'next-intl'
import { CONSTANTS } from '@/lib/constants'
import { toast } from '@/components/toast'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/cn'
import Image from 'next/image'

import type { User } from '@/types/user'

type SettingsProfilePictureProps = {
  user: User
}

export const SettingsProfilePicture: React.FC<SettingsProfilePictureProps> = ({
  user
}: SettingsProfilePictureProps): React.ReactNode => {
  const router = useRouter()

  const t = useTranslations()

  const [uploading, setUploading] = useState(false)

  const cookieMonster = new CookieMonster()

  const ref = useRef<HTMLInputElement>(null)
  const upload = async () => {
    const file = ref.current?.files?.[0] || null
    if (!file) return

    const token = cookieMonster.get(CONSTANTS.COOKIES.TOKEN_NAME)
    if (token) {
      setUploading(true)

      toast(t('settings.account.uploading'))

      const error = await useUpload(token, file, async (file, url) => {
        await UserAPIManager.update(token, {
          profilePicture: url
        })
      })

      if (error) {
        switch (error) {
          case 'size':
            toast(t('errors.upload-size'))
            break
          case 'upload':
            toast(t('errors.upload-fail'))
            break
        }
      }

      toast(t('common.success'))

      router.refresh()
    }

    setUploading(false)
  }

  return (
    <div className='relative group size-32 overflow-hidden'>
      <Image
        height={128}
        width={128}
        className='size-full object-cover p-1 border border-border rounded-full'
        alt={t('settings.account.profile-picture')}
        src={user?.profilePicture || '/images/placeholder.png'}
      />

      <label
        className={cn(
          buttonVariants({
            variant: 'round',
            color: 'secondary',
            className: cn(
              'absolute invisible opacity-0 group-hover:opacity-100 group-hover:visible bottom-0 right-0 transition-all duration-300',
              uploading && 'opacity-50 pointer-events-none'
            )
          })
        )}
        htmlFor='upload'
      >
        <Plus size={16} />

        <input
          ref={ref}
          readOnly={uploading}
          disabled={uploading}
          id='upload'
          className='sr-only'
          type='file'
          onChange={async (e) => {
            e.preventDefault()

            await upload()
          }}
        />
      </label>
    </div>
  )
}
