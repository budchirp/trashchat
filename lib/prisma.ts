import 'server-only'

import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Secrets } from '@/lib/secrets'

const adapter = new PrismaPg({
  connectionString: Secrets.databaseUrl
})

export const prisma = new PrismaClient({
  adapter
})
