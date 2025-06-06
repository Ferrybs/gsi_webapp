"use server";
import { ActionResponse } from "@/types/action-response";
import { updateUserPaymentStatus } from "./update-user-payment-status";
import { ActionError } from "@/types/action-error";
import { stripe } from "@/lib/stripe";
import { getCurrentUser } from "../user/get-current-user";
import { prisma } from "@/lib/prisma";

export default async function cancelUserPaymentAction(
  paymentId: string
): Promise<ActionResponse<boolean>> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new ActionError("error.user_not_authenticated");
    }
    const payment = await prisma.user_payments.findUnique({
      where: {
        id: paymentId,
        user_id: user.id,
      },
    });
    if (!payment) {
      return {
        success: false,
        error_message: "error.payment_not_found",
      };
    }
    const res = await updateUserPaymentStatus({
      paymentId: payment.id,
      paymentStatus: "Canceled",
    });
    console.log(`Cancelling payment with ID: ${paymentId}`);
    if (!res) {
      return {
        success: false,
        error_message: "error.payment_not_found",
      };
    }
    if (!payment.provider_transaction_id) {
      return {
        success: false,
        error_message: "error.internal_error",
      };
    }
    const session = await stripe.paymentIntents.retrieve(
      payment.provider_transaction_id
    );
    if (!session) {
      return {
        success: false,
        error_message: "error.payment_not_found",
      };
    }
    if (session.status === "processing") {
      const stripe_res = await stripe.paymentIntents.cancel(
        payment.provider_transaction_id
      );
      if (!stripe_res) {
        return {
          success: false,
          error_message: "error.internal_error",
        };
      }
    }
    console.log(`Payment with ID: ${paymentId} cancelled successfully.`);
    return { success: true, data: true };
  } catch (error) {
    console.error("Error cancelling payment:", error);
    if (error instanceof ActionError) {
      return {
        success: false,
        error_message: error.message,
      };
    }
    return {
      success: false,
      error_message: "error.internal_error",
    };
  }
}
