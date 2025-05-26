import { ActionResponse } from "@/types/action-response";
import { updateUserPaymentStatus } from "./update-user-payment-status";

export default async function cancelUserPaymentAction(
  paymentId: string,
): Promise<ActionResponse<boolean>> {
  try {
    updateUserPaymentStatus({ paymentId, paymentStatus: "Canceled" });
    console.log(`Cancelling payment with ID: ${paymentId}`);

    return { success: true, data: true };
  } catch (error) {
    console.error("Error cancelling payment:", error);
    return {
      success: false,
      error_message: "error.payment_cancellation_failed",
    };
  }
}
