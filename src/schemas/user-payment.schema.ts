import { z } from "zod";
import { currency, payment_provider, payment_status } from "@prisma/client";
import { stringToDate } from "./helper.schema";

export const PaymentProviderEnum = z.nativeEnum(payment_provider);
export const CurrencyEnum = z.nativeEnum(currency);
export const PaymentStatusEnum = z.nativeEnum(payment_status);

export const UserPaymentSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  provider: PaymentProviderEnum,
  provider_transaction_id: z.string().nullable(),
  package_id: z.number(),
  status: PaymentStatusEnum.default("Pending"),
  created_at: stringToDate,
  updated_at: stringToDate,
});

export type UserPayment = z.infer<typeof UserPaymentSchema>;

export type PaymentStatus = z.infer<typeof PaymentStatusEnum>;
