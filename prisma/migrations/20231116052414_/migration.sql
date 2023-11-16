/*
  Warnings:

  - You are about to drop the column `userId` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `trx_item` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "payment" DROP CONSTRAINT "payment_userId_fkey";

-- DropForeignKey
ALTER TABLE "trx" DROP CONSTRAINT "trx_user_id_fkey";

-- DropForeignKey
ALTER TABLE "trx_item" DROP CONSTRAINT "trx_item_product_id_fkey";

-- DropForeignKey
ALTER TABLE "trx_item" DROP CONSTRAINT "trx_item_userId_fkey";

-- AlterTable
ALTER TABLE "payment" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "trx_item" DROP COLUMN "userId";
