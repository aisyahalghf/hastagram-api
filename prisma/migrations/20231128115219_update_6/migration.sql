-- AlterTable
ALTER TABLE "histories" ADD COLUMN     "proof" TEXT,
ADD COLUMN     "sender" TEXT;

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "proof" TEXT,
ADD COLUMN     "sender" TEXT;
