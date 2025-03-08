export type User = {
  id: number

  name: string
  username: string

  email: string

  password: string

  profilePicure?: string

  plus: boolean

  credits: number
  premiumCredits: number

  systemPrompt: string

  shareInfoWithAI: boolean
}
