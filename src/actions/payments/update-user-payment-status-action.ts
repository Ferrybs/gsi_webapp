"use server";

import { getCurrentUserAction } from "../user/get-current-user-action";
import paymentStatusChangedEvent from "../stream/payment-status-changed-event";

export async function updateUserPaymentStatusAction(
  paymentId: string,
  status: "Failed" | "Canceled",
) {
  try {
    const user = await getCurrentUserAction();

    if (!user) {
      throw new Error("User not found");
    }

    await paymentStatusChangedEvent({
      payment_id: paymentId,
      new_status: status,
    });

    return { success: true };
  } catch (error) {
    console.error(`Error updating payment status to ${status}:`, error);
    return {
      success: false,
      error: `Failed to update payment status to ${status}`,
    };
  }
}
