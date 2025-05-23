export type APIHeaders = {
  token: string
  locale?: string
}

export type UnprotectedAPIHeaders = Omit<APIHeaders, 'token'>
