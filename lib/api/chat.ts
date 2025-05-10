import { Fetch } from '@/lib/fetch'
import { Env } from '@/lib/env'

import type { Chat } from '@/types/chat'
import type { APIResponse } from '@/types/api'

export class ChatAPIManager {
  public static get = async (token: string, id: string): Promise<Chat | null> => {
    try {
      const response = await Fetch.get<APIResponse<Chat>>(`${Env.appUrl}/api/chat/${id}`, {
        authorization: `Bearer ${token}`
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

  public static getAll = async (token: string): Promise<Chat[] | null> => {
    try {
      const response = await Fetch.get<APIResponse<Chat[]>>(`${Env.appUrl}/api/chat`, {
        authorization: `Bearer ${token}`
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

  public static delete = async (token: string, id: string): Promise<boolean> => {
    try {
      const response = await Fetch.delete(`${Env.appUrl}/api/chat/${id}`, {
        Authorization: `Bearer ${token}`
      })

      if (response.ok) return true

      return false
    } catch (error) {
      return false
    }
  }

  public static new = async (token: string): Promise<Chat | null> => {
    try {
      const response = await Fetch.post<APIResponse<Chat>>(
        `${Env.appUrl}/api/chat`,
        {},
        {
          Authorization: `Bearer ${token}`
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
