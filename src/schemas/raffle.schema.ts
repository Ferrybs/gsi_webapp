import { raffle_status_enum } from "@prisma/client";
import { z } from "zod";

export const RaffleSchema = z.object({
  id: z.string().uuid(),
  skin_id: z.number(),
  ticket_price: z.string(),
  status: z.nativeEnum(raffle_status_enum),
  winner_user_id: z.string().uuid().nullable(),
  drawn_at: z.string().nullable(),
  end_at: z.string().refine((val) => !isNaN(Date.parse(val))),
  created_at: z.string().refine((val) => !isNaN(Date.parse(val))),
  updated_at: z.string().refine((val) => !isNaN(Date.parse(val))),
});

export type Raffle = z.infer<typeof RaffleSchema>;

export const PurchaseTicketsSchema = z.object({
  raffle_id: z.string().uuid(),
  quantity: z.number().int().min(1),
});

export type PurchaseTicketsInput = z.infer<typeof PurchaseTicketsSchema>;
