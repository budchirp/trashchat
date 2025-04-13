'use client'

import * as cookie from 'cookie'

type CookieName = string
type CookieValue = string | undefined
type Cookie = {
  name: CookieName
  value: CookieValue
}

export class CookieMonster {
  private stringfy = (value: unknown): string => {
    return typeof value === 'string' ? value : JSON.stringify(value)
  }

  public get = (key: string): CookieValue => {
    const cookies = cookie.parse(document.cookie)
    return cookies[key]
  }

  public getAll = (): Cookie[] => {
    const parsedCookies = cookie.parse(document.cookie)

    return Object.entries(parsedCookies).map(([name, value]) => ({
      name,
      value
    }))
  }

  public set = (key: string, value: unknown, options?: cookie.SerializeOptions): void => {
    document.cookie = cookie.serialize(key, this.stringfy(value), {
      ...options,
      expires: new Date(2147483647000)
    })
  }

  public delete = (key: string): void => {
    this.set(key, '', {
      maxAge: -1
    })

    document.cookie = cookie.serialize(key, '', {
      maxAge: -1,
      expires: new Date(0)
    })
  }

  public has = (key: string): boolean => {
    return Boolean(cookie.parse(document.cookie)[key])
  }
}
