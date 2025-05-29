import { currency, exterior } from "@prisma/client";
import { z } from "zod";
import { decimalToNumber } from "./helper.schema";

export const SkinSchema = z.object({
  id: z.number(),
  market_hash_name: z.string(),
  type: z.string(),
  image_url: z.string().url().optional(),
  tradable: z.boolean(),
  exterior: z.nativeEnum(exterior),
  currency: z.nativeEnum(currency).default("USD"),
  fiat_value: decimalToNumber, // estimated_fiat_value.mult(1+fee_pct)
  created_at: z.string().refine((val) => !isNaN(Date.parse(val))),
  updated_at: z.string().refine((val) => !isNaN(Date.parse(val))),
});

export type Skin = z.infer<typeof SkinSchema>;
