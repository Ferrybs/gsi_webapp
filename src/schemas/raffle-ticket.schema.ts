import { z } from "zod";

export const RaffleTicketSchema = z.object({
  id: z.number().int(),
  raffle_id: z.string().uuid(),
  created_at: z.string().refine((val) => !isNaN(Date.parse(val))),
});

export type RaffleTicket = z.infer<typeof RaffleTicketSchema>;
