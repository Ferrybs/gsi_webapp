import { z } from "zod";
import { CurrencyEnum } from "./user-payment.schema";
import { decimalToNumber } from "./helper.schema";

export const PointPackageSchema = z.object({
  id: z.number(),
  name: z.string(),
  points_amount: decimalToNumber,
  price: decimalToNumber,
  currency: CurrencyEnum,
  bonus_points: decimalToNumber,
  active: z.boolean().default(true),
  created_at: z.string().or(z.date()),
  updated_at: z.string().or(z.date()),
});

export type PointPackage = z.infer<typeof PointPackageSchema>;
