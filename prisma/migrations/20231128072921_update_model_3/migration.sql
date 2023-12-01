/*
  Warnings:

  - The primary key for the `histories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `balance` to the `histories` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `histories` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "histories" DROP CONSTRAINT "histories_pkey",
ADD COLUMN     "balance" INTEGER NOT NULL,
ADD COLUMN     "status" TEXT,
DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "transactions" (
    "id" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "nominal" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'waiting for payment proof',
    "userId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "transactions_code_key" ON "transactions"("code");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
