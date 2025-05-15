import { z } from "zod";
import { transaction_type } from "@prisma/client";

export const TransactionTypeEnum = z.nativeEnum(transaction_type);

export const UserTransactionSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  amount: z.coerce.number(),
  type: TransactionTypeEnum,
  description: z.string().nullable(),
  created_at: z.string().or(z.date()),
});

export type UserTransaction = z.infer<typeof UserTransactionSchema>;
