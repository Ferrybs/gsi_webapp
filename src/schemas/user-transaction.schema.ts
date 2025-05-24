import {
  currency,
  option_label,
  payment_provider,
  payment_status,
  transaction_type,
} from "@prisma/client";
import { z } from "zod";
import { decimalToNumber, stringToDate } from "./helper.schema";

export const TransactionTypeSchema = z.nativeEnum(transaction_type);

export const UserTransactionSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  amount: decimalToNumber,
  type: TransactionTypeSchema,
  description: z.string().nullable(),
  created_at: stringToDate,
});

export const UserTransactionsSchema = z.array(UserTransactionSchema);

export type UserTransaction = z.infer<typeof UserTransactionSchema>;
export type TransactionType = z.infer<typeof TransactionTypeSchema>;
