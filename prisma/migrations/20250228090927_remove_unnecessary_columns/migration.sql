/*
  Warnings:

  - You are about to drop the column `flipd` on the `environment` table. All the data in the column will be lost.
  - You are about to drop the column `telegram_url` on the `environment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "environment" DROP COLUMN "flipd",
DROP COLUMN "telegram_url";
