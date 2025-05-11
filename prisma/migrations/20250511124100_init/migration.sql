-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CARD', 'CRYPTO');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "paymentMethod" "PaymentMethod";
