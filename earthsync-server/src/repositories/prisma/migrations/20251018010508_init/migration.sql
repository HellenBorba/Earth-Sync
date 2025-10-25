/*
  Warnings:

  - You are about to drop the column `termo` on the `historico` table. All the data in the column will be lost.
  - Added the required column `query` to the `Historico` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `historico` DROP COLUMN `termo`,
    ADD COLUMN `query` VARCHAR(191) NOT NULL;
