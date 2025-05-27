import { Fetch } from '@/lib/fetch'
import { Env } from '@/lib/env'

import type { Chat } from '@/types/chat'
import type { APIResponse } from '@/types/api'
import type { APIHeaders } from '@/types/api-headers'

export class ChatAPIManager {
  public static get = async (headers: APIHeaders, id: string): Promise<Chat | null> => {
    try {
      const response = await Fetch.get<APIResponse<Chat>>(`${Env.appUrl}/api/chat/${id}`, {
        authorization: `Bearer ${headers.token}`,
        'accept-language': headers.locale || 'en'
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

  public static getAll = async (headers: APIHeaders): Promise<Chat[] | null> => {
    try {
      const response = await Fetch.get<APIResponse<Chat[]>>(`${Env.appUrl}/api/chat`, {
        authorization: `Bearer ${headers.token}`,
        'accept-language': headers.locale || 'en'
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

  public static delete = async (headers: APIHeaders, id: string): Promise<boolean> => {
    try {
      const response = await Fetch.delete(`${Env.appUrl}/api/chat/${id}`, {
        authorization: `Bearer ${headers.token}`,
        'accept-language': headers.locale || 'en'
      })

      if (response.ok) return true

      return false
    } catch (error) {
      return false
    }
  }

  public static deleteMessage = async (
    headers: APIHeaders,
    chatId: string,
    messageId: number
  ): Promise<boolean> => {
    try {
      const response = await Fetch.delete(`${Env.appUrl}/api/chat/${chatId}/message/${messageId}`, {
        authorization: `Bearer ${headers.token}`,
        'accept-language': headers.locale || 'en'
      })

      if (response.ok) return true

      return false
    } catch (error) {
      return false
    }
  }

  public static new = async (headers: APIHeaders): Promise<Chat | null> => {
    try {
      const response = await Fetch.post<APIResponse<Chat>>(
        `${Env.appUrl}/api/chat`,
        {},
        {
          authorization: `Bearer ${headers.token}`,
          'accept-language': headers.locale || 'en'
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

  public static update = async (
    headers: APIHeaders,
    id: string,
    data: Partial<Chat>
  ): Promise<[true, undefined] | [false, string | null]> => {
    try {
      const response = await Fetch.patch<APIResponse<Chat>>(`${Env.appUrl}/api/chat/${id}`, data, {
        authorization: `Bearer ${headers.token}`,
        'accept-language': headers.locale || 'en'
      })

      if (response.ok) return [true, undefined]

      const json = await response.json()
      return [false, json.message]
    } catch {
      return [false, null]
    }
  }
}
