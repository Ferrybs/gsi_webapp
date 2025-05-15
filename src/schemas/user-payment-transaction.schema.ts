import { z } from "zod";

export const UserPaymentTransactionSchema = z.object({
  user_transaction_id: z.string().uuid(),
  user_payments_id: z.string().uuid(),
});

export type UserPaymentTransaction = z.infer<
  typeof UserPaymentTransactionSchema
>;
