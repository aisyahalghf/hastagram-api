import { Transaction } from "@prisma/client";

export interface TransactionDto extends Transaction {
  date?: string;
}
