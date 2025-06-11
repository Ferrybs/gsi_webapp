import { raffle_status } from "@prisma/client";
import { z } from "zod";
import { decimalToNumber, stringToDate } from "./helper.schema";

export const RaffleSchema = z.object({
  id: z.string().uuid(),
  skin_id: z.bigint(),
  ticket_price: decimalToNumber,
  status: z.nativeEnum(raffle_status),
  winner_user_id: z.string().uuid().nullable(),
  drawn_at: stringToDate.nullable(),
  end_at: stringToDate,
  created_at: stringToDate,
  updated_at: stringToDate,
});

export type Raffle = z.infer<typeof RaffleSchema>;

export const PurchaseTicketsSchema = z.object({
  raffle_id: z.string().uuid(),
  quantity: z.number().int().min(1),
});

export type PurchaseTicketsInput = z.infer<typeof PurchaseTicketsSchema>;
