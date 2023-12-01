/*
  Warnings:

  - The `nominal` column on the `transactions` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
CREATE SEQUENCE histories_id_seq;
ALTER TABLE "histories" ALTER COLUMN "id" SET DEFAULT nextval('histories_id_seq');
ALTER SEQUENCE histories_id_seq OWNED BY "histories"."id";

-- AlterTable
CREATE SEQUENCE transactions_id_seq;
ALTER TABLE "transactions" ALTER COLUMN "id" SET DEFAULT nextval('transactions_id_seq'),
ALTER COLUMN "description" DROP NOT NULL,
DROP COLUMN "nominal",
ADD COLUMN     "nominal" INTEGER NOT NULL DEFAULT 0;
ALTER SEQUENCE transactions_id_seq OWNED BY "transactions"."id";
