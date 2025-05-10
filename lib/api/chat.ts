import { Fetch } from '@/lib/fetch'
import { Env } from '@/lib/env'

import type { Chat } from '@/types/chat'
import type { APIResponse } from '@/types/api'

type Metadata = {
  token: string
  locale?: string
}

export class ChatAPIManager {
  public static get = async (metadata: Metadata, id: string): Promise<Chat | null> => {
    try {
      const response = await Fetch.get<APIResponse<Chat>>(`${Env.appUrl}/api/chat/${id}`, {
        authorization: `Bearer ${metadata.token}`,
        'accept-language': metadata.locale || 'en'
      })

      const json = await response.json()
      if (response.ok) {
        return json.data
      }

      return null
    } catch (error) {
      return null
    }
  }

  public static getAll = async (metadata: Metadata): Promise<Chat[] | null> => {
    try {
      const response = await Fetch.get<APIResponse<Chat[]>>(`${Env.appUrl}/api/chat`, {
        authorization: `Bearer ${metadata.token}`,
        'accept-language': metadata.locale || 'en'
      })

      const json = await response.json()
      if (response.ok) {
        return json.data
      }

      return null
    } catch (error) {
      return null
    }
  }

  public static delete = async (metadata: Metadata, id: string): Promise<boolean> => {
    try {
      const response = await Fetch.delete(`${Env.appUrl}/api/chat/${id}`, {
        authorization: `Bearer ${metadata.token}`,
        'accept-language': metadata.locale || 'en'
      })

      if (response.ok) return true

      return false
    } catch (error) {
      return false
    }
  }

  public static new = async (metadata: Metadata): Promise<Chat | null> => {
    try {
      const response = await Fetch.post<APIResponse<Chat>>(
        `${Env.appUrl}/api/chat`,
        {},
        {
          authorization: `Bearer ${metadata.token}`,
          'accept-language': metadata.locale || 'en'
        }
      )

      if (response.ok) {
        const json = await response.json()
        return json.data
      }

      return null
    } catch (error) {
      return null
    }
  }
}
