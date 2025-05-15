"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUserAction } from "../user/get-current-user-action";
import { UserPaymentSchema } from "@/schemas/user-payment.schema";

export async function getUserPaymentData(paymentId: string) {
  const user = await getCurrentUserAction();
  if (!user) {
    throw new Error("User not found");
  }
  const payment = await prisma.user_payments.findUnique({
    where: { id: paymentId, user_id: user.id },
  });

  if (!payment) {
    return null;
  }

  return UserPaymentSchema.parse(payment);
}
