import { z } from "zod";

export const UserBalanceSchema = z.object({
  user_id: z.string().uuid(),
  balance: z.coerce.number().default(0),
  event_balance: z.coerce.number().default(0),
});

export type UserBalance = z.infer<typeof UserBalanceSchema>;
