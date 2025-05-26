"use server";

import { getCurrentUserAction } from "../user/get-current-user-action";
import paymentStatusChangedEvent from "../stream/payment-status-changed-event";
import { ActionResponse } from "@/types/action-response";
import {
  UpdatePaymentStatus,
  UpdatePaymentStatusSchema,
} from "@/schemas/handle-payment.schema";
import { ActionError } from "@/types/action-error";
import { prisma } from "@/lib/prisma";

export async function updateUserPaymentStatus({
  paymentId,
  paymentStatus,
}: UpdatePaymentStatus): Promise<ActionResponse<boolean>> {
  try {
    const data = UpdatePaymentStatusSchema.parse({
      paymentId,
      paymentStatus,
    });
    const user = await getCurrentUserAction();

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

    return { success: true, data: true };
  } catch (error) {
    console.error(`Error updating payment status to ${paymentStatus}:`, error);
    if (error instanceof ActionError) {
      return {
        success: false,
        error_message: error.message,
      };
    }
    return {
      success: false,
      error_message: "error.payment_status_update_failed",
    };
  }
}
