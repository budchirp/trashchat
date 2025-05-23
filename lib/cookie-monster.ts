import * as cookie from 'cookie'

import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'

type CookieName = string
type CookieValue = string | undefined
type Cookie = {
  name: CookieName
  value: CookieValue
}

export class CookieMonster {
  private cookieStore: ReadonlyRequestCookies | null = null

  constructor(cookieStore: ReadonlyRequestCookies | null = null) {
    this.cookieStore = cookieStore
  }

  private stringify = (value: unknown): string => {
    return typeof value === 'string' ? value : JSON.stringify(value)
  }

  public get = (key: string): CookieValue => {
    if (this.cookieStore) {
      return this.cookieStore.get(key)?.value
    }

    const cookies = cookie.parse(document.cookie)
    return cookies[key]
  }

  public getAll = (): Cookie[] => {
    if (this.cookieStore) {
      return this.cookieStore.getAll() as Cookie[]
    }

    const parsedCookies = cookie.parse(document.cookie)
    return Object.entries(parsedCookies).map(([name, value]) => ({
      name,
      value
    }))
  }

  public set = (key: string, value: unknown, options?: cookie.SerializeOptions): void => {
    if (this.cookieStore) {
      this.cookieStore.set(key, value as any, options as any)
      return
    }

    document.cookie = cookie.serialize(key, this.stringify(value), options)
  }

  public delete = (key: string): void => {
    this.set(key, '', {
      maxAge: -1
    })
  }

  public has = (key: string): boolean => {
    if (this.cookieStore) {
      return this.cookieStore.has(key)
    }

    return Boolean(cookie.parse(document.cookie)[key])
  }
}
