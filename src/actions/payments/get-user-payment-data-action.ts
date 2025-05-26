"use server";

import { prisma } from "@/lib/prisma";
import { UserPayment, UserPaymentSchema } from "@/schemas/user-payment.schema";
import { getCurrentUser } from "../user/get-current-user";
import { ActionResponse } from "@/types/action-response";

export async function getUserPaymentDataAction(
  paymentId: string,
): Promise<ActionResponse<UserPayment>> {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error_message: "error.user_not_authenticated" };
  }
  const payment = await prisma.user_payments.findUnique({
    where: { id: paymentId, user_id: user.id },
  });

  if (!payment) {
  }

  return { success: true, data: UserPaymentSchema.parse(payment) };
}
