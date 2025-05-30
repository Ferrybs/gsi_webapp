import { currency, exterior } from "@prisma/client";
import { z } from "zod";
import { decimalToNumber, stringToDate } from "./helper.schema";

export const SkinSchema = z.object({
  id: z.bigint(),
  market_hash_name: z.string(),
  type: z.string(),
  image_url: z.string().url().optional(),
  tradable: z.boolean(),
  exterior: z.nativeEnum(exterior),
  currency: z.nativeEnum(currency).default("USD"),
  fiat_value: decimalToNumber, // estimated_fiat_value.mult(1+fee_pct)
  created_at: stringToDate,
  updated_at: stringToDate,
});

export type Skin = z.infer<typeof SkinSchema>;
