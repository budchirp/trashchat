import imageCompression from 'browser-image-compression'
import { Fetch } from '@/lib/fetch'

import type { Metadata } from '@/lib/api/user'

export const useUpload = async (
  metadata: Metadata,
  file: File,
  onUpload: (file: File, url: string) => void
): Promise<'size' | 'upload' | undefined> => {
  if (file.size > 1024 * 1024 * 3) {
    return 'size'
  }

  try {
    const response = await Fetch.post<{
      data: {
        name: string
        url: string
        fields: any
      }
    }>(
      '/api/upload',
      {
        file: {
          name: file.name,
          contentType: file.type
        }
      },
      {
        authorization: `Bearer ${metadata.token}`,
        'accept-language': metadata.locale || 'en'
      }
    )

    if (response.ok) {
      const json = await response.json()

      const { url, fields } = json.data

      const formData = new FormData()
      for (const [key, value] of Object.entries(fields)) {
        formData.append(key, value as string)
      }

      let compressed = file
      try {
        if (file.type.startsWith('image/'))
          compressed = await imageCompression(file, {
            maxSizeMB: 1,
            useWebWorker: true
          })
      } catch {
        compressed = file
      }

      formData.append(
        'file',
        new File([compressed.slice(0, compressed.size, compressed.type)], fields.key, {
          type: compressed.type
        })
      )

      try {
        await Fetch.post(url, formData)
      } catch {}

      onUpload(file, `${url}${fields.key}`)
    }
  } catch {
    return 'upload'
  }
}
