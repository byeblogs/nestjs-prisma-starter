/*
  Warnings:

  - You are about to drop the column `content` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `post` table. All the data in the column will be lost.
  - Added the required column `description` to the `post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `post` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "post_title_idx";

-- AlterTable
ALTER TABLE "post" DROP COLUMN "content",
DROP COLUMN "title",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "post_name_idx" ON "post"("name");
