/*
  Warnings:

  - You are about to drop the column `published` on the `post` table. All the data in the column will be lost.
  - Made the column `user_id` on table `org` required. This step will fail if there are existing NULL values in that column.
  - Made the column `content` on table `post` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `post` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `product` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "FeeStatus" AS ENUM ('Active', 'Inactive');

-- CreateEnum
CREATE TYPE "FeeType" AS ENUM ('Fix', 'Percentage');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('BankTransfer', 'Cash');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('Cancelled', 'Expire', 'Reject', 'Success', 'WaitingForPayment');

-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('Active', 'Draft', 'Inactive');

-- CreateEnum
CREATE TYPE "Uom" AS ENUM ('PCS');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('IDR');

-- CreateEnum
CREATE TYPE "TaxStatus" AS ENUM ('Active', 'Inactive');

-- CreateEnum
CREATE TYPE "TaxType" AS ENUM ('Fix', 'Percentage');

-- CreateEnum
CREATE TYPE "TrxStatus" AS ENUM ('Cancelled', 'Expire', 'Reject', 'Success', 'WaitingForPayment');

-- CreateEnum
CREATE TYPE "TrxItemStatus" AS ENUM ('Active', 'Inactive');

-- DropForeignKey
ALTER TABLE "org" DROP CONSTRAINT "org_user_id_fkey";

-- DropForeignKey
ALTER TABLE "post" DROP CONSTRAINT "post_user_id_fkey";

-- AlterTable
ALTER TABLE "category" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "org" ALTER COLUMN "user_id" SET NOT NULL,
ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "post" DROP COLUMN "published",
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "status" "PostStatus" NOT NULL DEFAULT 'Draft',
ALTER COLUMN "content" SET NOT NULL,
ALTER COLUMN "user_id" SET NOT NULL,
ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "product" ADD COLUMN     "currency" "Currency" DEFAULT 'IDR',
ADD COLUMN     "min_order_qty" INTEGER DEFAULT 0,
ADD COLUMN     "price" DECIMAL(65,30) DEFAULT 0,
ADD COLUMN     "qty" INTEGER DEFAULT 0,
ADD COLUMN     "sku" TEXT,
ADD COLUMN     "uom" "Uom" DEFAULT 'PCS',
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ALTER COLUMN "updated_at" DROP NOT NULL;

-- CreateTable
CREATE TABLE "fee" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "amount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "org_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "type" "FeeType" NOT NULL,
    "status" "FeeStatus" NOT NULL,

    CONSTRAINT "fee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "total" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "trx_id" TEXT NOT NULL,
    "buyer_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "type" "PaymentType" NOT NULL,
    "status" "PaymentStatus" NOT NULL,
    "userId" TEXT,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tax" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "amount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "org_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "type" "TaxType" NOT NULL,
    "status" "TaxStatus" NOT NULL,

    CONSTRAINT "tax_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trx" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "qty" INTEGER NOT NULL DEFAULT 0,
    "subTotal" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "tax" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "fee" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "total" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "buyer_id" TEXT NOT NULL,
    "seller_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "status" "TrxStatus" NOT NULL,

    CONSTRAINT "trx_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trx_item" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "qty" INTEGER NOT NULL DEFAULT 0,
    "product_id" TEXT NOT NULL,
    "trx_id" TEXT,
    "buyer_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "status" "TrxItemStatus" NOT NULL,
    "userId" TEXT,

    CONSTRAINT "trx_item_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "fee" ADD CONSTRAINT "fee_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "org"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "org" ADD CONSTRAINT "org_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_trx_id_fkey" FOREIGN KEY ("trx_id") REFERENCES "trx"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tax" ADD CONSTRAINT "tax_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "org"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trx" ADD CONSTRAINT "trx_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trx_item" ADD CONSTRAINT "trx_item_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trx_item" ADD CONSTRAINT "trx_item_trx_id_fkey" FOREIGN KEY ("trx_id") REFERENCES "trx"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trx_item" ADD CONSTRAINT "trx_item_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
