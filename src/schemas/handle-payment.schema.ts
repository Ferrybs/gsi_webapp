import { payment_provider, payment_status } from "@prisma/client";
import { z } from "zod";

export const CreatePaymentSchema = z.object({
  packageId: z.number(),
  provider: z.nativeEnum(payment_provider),
});

export type CreatePayment = z.infer<typeof CreatePaymentSchema>;

export const CreatePaymentResponseSchema = z.object({
  url: z.string(),
  paymentId: z.string(),
});

export type CreatePaymentResponse = z.infer<typeof CreatePaymentResponseSchema>;

export const UpdatePaymentStatusSchema = z.object({
  paymentId: z.string(),
  paymentStatus: z.nativeEnum(payment_status),
});

export type UpdatePaymentStatus = z.infer<typeof UpdatePaymentStatusSchema>;

export const ProcessPaymentResponseSchema = z.object({
  payment_status: z.nativeEnum(payment_status),
  message: z.string(),
});
export type ProcessPaymentResponse = z.infer<
  typeof ProcessPaymentResponseSchema
>;
