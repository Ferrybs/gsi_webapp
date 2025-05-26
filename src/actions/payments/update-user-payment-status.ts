"use server";

import paymentStatusChangedEvent from "../stream/payment-status-changed-event";
import {
  UpdatePaymentStatus,
  UpdatePaymentStatusSchema,
} from "@/schemas/handle-payment.schema";
import { ActionError } from "@/types/action-error";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "../user/get-current-user";

export async function updateUserPaymentStatus({
  paymentId,
  paymentStatus,
}: UpdatePaymentStatus): Promise<boolean> {
  try {
    const data = UpdatePaymentStatusSchema.parse({
      paymentId,
      paymentStatus,
    });
    const user = await getCurrentUser();

    if (!user) {
      throw new ActionError("error.user_not_authenticated");
    }

    const payment = await prisma.user_payments.findUnique({
      where: {
        id: data.paymentId,
        user_id: user.id,
      },
    });

    if (!payment) {
      throw new ActionError("error.payment_not_found");
    }

    await paymentStatusChangedEvent({
      payment_id: payment.id,
      new_status: paymentStatus,
    });

    return true;
  } catch (error) {
    console.error(`Error updating payment status to ${paymentStatus}:`, error);
    if (error instanceof ActionError) {
      throw error;
    }
    throw new ActionError("error.update_payment_status_failed");
  }
}
