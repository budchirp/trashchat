import { Env } from '../env'
import { Fetch } from '../fetch'

import type { Chat } from '@/types/chat'

export class ChatManager {
  public static get = async (token: string, id: string): Promise<Chat | null> => {
    try {
      const response = await Fetch.get<{
        data: Chat
      }>(`${Env.appUrl}/api/chat/${id}`, {
        authorization: `Bearer ${token}`
      })

      const json = await response.json()
      if (response.status < 400) {
        return json.data
      }

      return null
    } catch (error) {
      console.log(error)

      return null
    }
  }

  public static getAll = async (token: string): Promise<Chat[]> => {
    try {
      const response = await Fetch.get<{
        data: Chat[]
      }>(`${Env.appUrl}/api/chats`, {
        authorization: `Bearer ${token}`
      })

      const json = await response.json()
      if (response.status < 400) {
        return json.data
      }

      return []
    } catch (error) {
      console.log(error)

      return []
    }
  }

  public static delete = async (token: string, id: string): Promise<boolean> => {
    try {
      const response = await Fetch.delete<{
        data: Chat[]
      }>(`${Env.appUrl}/api/chat/${id}`, {
        Authorization: `Bearer ${token}`
      })

      if (response.status < 400) return true

      return false
    } catch (error) {
      console.log(error)

      return false
    }
  }

  public static new = async (token: string): Promise<Chat | null> => {
    try {
      const response = await Fetch.post<{
        data: Chat
      }>(
        `${Env.appUrl}/api/chats`,
        {},
        {
          Authorization: `Bearer ${token}`
        }
      )

      if (response.status < 400) {
        const json = await response.json()
        return json.data
      }

      return null
    } catch (error) {
      console.log(error)

      return null
    }
  }
}
