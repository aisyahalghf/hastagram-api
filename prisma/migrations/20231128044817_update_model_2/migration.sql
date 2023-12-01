/*
  Warnings:

  - You are about to drop the column `balance` on the `histories` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "histories" DROP COLUMN "balance";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "saldo" INTEGER NOT NULL DEFAULT 0;
