import 'server-only'

import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Secrets } from '@/lib/secrets'

const adapter = new PrismaPg({
  connectionString: Secrets.databaseUrl
})

let prisma: PrismaClient
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  if (!(global as any).prisma) {
    ; (global as any).prisma = new PrismaClient({
      adapter
    })
  }

  prisma = (global as any).prisma
}

export { prisma }
