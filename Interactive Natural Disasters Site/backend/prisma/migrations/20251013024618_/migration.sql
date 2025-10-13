/*
  Warnings:

  - You are about to drop the column `data` on the `historico` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `historico` DROP COLUMN `data`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
