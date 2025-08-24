/*
  Warnings:

  - You are about to drop the column `alt_text` on the `gallery` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `gallery` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "gallery" DROP COLUMN "alt_text",
DROP COLUMN "tags";
