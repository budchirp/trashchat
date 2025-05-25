import { CONSTANTS } from '@/lib/constants'
import { prisma } from '@/lib/prisma'

const deleteUnverifiedUsers = async (): Promise<void> => {
  console.log('Deleting unverified users...')

  const unverifiedUsers = await prisma.user.findMany({
    where: {
      isEmailVerified: false,
      createdAt: {
        lte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30) // 30 days ago
      }
    }
  })

  let deletedCount = 0
  for (const user of unverifiedUsers) {
    await prisma.user.delete({
      where: {
        id: user.id
      }
    })

    deletedCount++
  }

  console.log(`Deleted ${deletedCount} unverified users`)
}

const deleteExpiredSubscriptions = async (): Promise<void> => {
  console.log('Deleting expired subscriptions...')

  const result = await prisma.subscription.deleteMany({
    where: {
      expiresAt: {
        lt: new Date()
      }
    }
  })

  console.log(`Deleted ${result.count} expired subscriptions`)
}

const increaseLimits = async (): Promise<void> => {
  console.log('Increasing limits...')

  const users = await prisma.user.findMany({
    where: {
      isEmailVerified: true,
      usages: {
        updatedAt: {
          lte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10)
        }
      }
    },
    include: {
      subscription: true
    }
  })

  let updatedCount = 0
  for (const user of users) {
    await prisma.usages.update({
      where: {
        userId: user.id
      },
      data: {
        updatedAt: new Date(),

        credits: user.subscription
          ? CONSTANTS.USAGES.PLUS.CREDITS
          : CONSTANTS.USAGES.NORMAL.CREDITS,
        premiumCredits: user.subscription
          ? CONSTANTS.USAGES.PLUS.PREMIUM_CREDITS
          : CONSTANTS.USAGES.NORMAL.PREMIUM_CREDITS
      }
    })

    updatedCount++
  }

  console.log(`Updated limits for ${updatedCount} users`)
}

const runCronJobs = async (): Promise<void> => {
  console.log(`Starting cron jobs at ${new Date().toISOString()}`)

  try {
    await deleteUnverifiedUsers()
    await deleteExpiredSubscriptions()

    await increaseLimits()

    console.log(`Cron jobs completed successfully at ${new Date().toISOString()}`)
  } catch (error) {
    console.error('Error running cron jobs:', error)
    process.exit(1)
  }
}

await runCronJobs()
