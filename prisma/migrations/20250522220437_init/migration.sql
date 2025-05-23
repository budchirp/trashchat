/*
  Warnings:

  - You are about to drop the column `created_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `credits` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `isPlus` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `paymentMethod` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `plusExpiresAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `premiumCredits` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `profilePicture` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `shareInfoWithAI` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `systemPrompt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "created_at",
DROP COLUMN "credits",
DROP COLUMN "isPlus",
DROP COLUMN "name",
DROP COLUMN "paymentMethod",
DROP COLUMN "plusExpiresAt",
DROP COLUMN "premiumCredits",
DROP COLUMN "profilePicture",
DROP COLUMN "shareInfoWithAI",
DROP COLUMN "systemPrompt",
DROP COLUMN "updated_at";

-- CreateTable
CREATE TABLE "usages" (
    "id" SERIAL NOT NULL,
    "credits" INTEGER NOT NULL DEFAULT 10,
    "premiumCredits" INTEGER NOT NULL DEFAULT 0,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "usages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_customizations" (
    "id" SERIAL NOT NULL,
    "defaultModel" TEXT,
    "systemPrompt" TEXT NOT NULL DEFAULT '',
    "shareInfoWithAI" BOOLEAN NOT NULL DEFAULT true,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ai_customizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "profilePicture" TEXT,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "userId" INTEGER NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" SERIAL NOT NULL,
    "paymentMethod" "PaymentMethod",
    "expiresAt" TIMESTAMP(3),
    "userId" INTEGER NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usages_id_key" ON "usages"("id");

-- CreateIndex
CREATE UNIQUE INDEX "usages_userId_key" ON "usages"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ai_customizations_id_key" ON "ai_customizations"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ai_customizations_userId_key" ON "ai_customizations"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_id_key" ON "profiles"("id");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_userId_key" ON "profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_id_key" ON "sessions"("id");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_id_key" ON "subscriptions"("id");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_userId_key" ON "subscriptions"("userId");

-- AddForeignKey
ALTER TABLE "usages" ADD CONSTRAINT "usages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_customizations" ADD CONSTRAINT "ai_customizations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
