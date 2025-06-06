"use server";

import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import {
  payment_provider,
  payment_status,
  user_payments,
} from "@prisma/client";
import { CoinbaseTimelineStatusSchema } from "@/schemas/coinbase-payment-status.schema";
import { coinbaseGetLastEvent } from "@/lib/utils";
import paymentStatusChangedEvent from "../stream/payment-status-changed-event";
import { revalidatePath } from "next/cache";
import { ActionResponse } from "@/types/action-response";
import { ProcessPaymentResponse } from "@/schemas/handle-payment.schema";
import { ActionError } from "@/types/action-error";
import { getCurrentUser } from "../user/get-current-user";

export async function processUserPaymentSuccessAction(
  paymentId: string
): Promise<ActionResponse<ProcessPaymentResponse>> {
  try {
    const user = await getCurrentUser();

    if (!user?.id) {
      throw new ActionError("error.user_not_authenticated");
    }

    const payment = await prisma.user_payments.findUnique({
      where: {
        id: paymentId,
        user_id: user.id,
      },
    });

    if (!payment || payment.provider_transaction_id === null) {
      throw new Error("Payment not found");
    }

    if (payment.status !== "Pending") {
      revalidatePath("/payment/success");
      return {
        success: true,
        data: {
          payment_status: payment.status,
          message:
            payment.status === "Processing"
              ? "payment.processing_description"
              : "payment.already_processed",
        },
      };
    }

    let paymentStatus: payment_status;

    switch (payment.provider) {
      case payment_provider.Stripe:
        paymentStatus = await processStripePaymentSuccessAction(
          payment.provider_transaction_id
        );
        break;
      case payment_provider.Coinbase:
        paymentStatus = await processCoinbasePaymentSuccessAction(payment);
        break;
    }

    if (!paymentStatus) {
      return {
        success: false,
        error_message: "error.payment_status_not_found",
      };
    }

    await paymentStatusChangedEvent({
      payment_id: payment.id,
      new_status: paymentStatus,
    });

    revalidatePath("/payment/success");

    return {
      success: true,
      data: {
        payment_status: "Processing",
        message: "payment.processing_description",
      },
    };
  } catch (error) {
    console.error("Error processing payment success:", error);
    return {
      success: false,
      error_message: "error.failed_to_process_payment",
    };
  }
}

async function processStripePaymentSuccessAction(sessionID: string) {
  const session = await stripe.paymentIntents.retrieve(sessionID);

  if (!session) {
    return "Failed";
  }
  if (session.status === "canceled") {
    return "Canceled";
  }
  if (session.status === "succeeded") {
    return "Completed";
  }
  return "Processing";
}

async function processCoinbasePaymentSuccessAction(payment: user_payments) {
  const response = await fetch(
    `https://api.commerce.coinbase.com/charges/${payment.provider_transaction_id}`,
    {
      headers: {
        Accept: "application/json",
        "X-CC-Api-Key": process.env.COINBASE_API_KEY!,
        "X-CC-Version": "2018-03-22",
      },
    }
  );

  const json = await response.json();
  const parsed = CoinbaseTimelineStatusSchema.safeParse(json.data);
  if (!parsed.success) {
    return "Failed";
  }

  const lastEvent = coinbaseGetLastEvent(parsed.data.timeline);
  if (lastEvent.status === "COMPLETED" || lastEvent.status === "CONFIRMED") {
    return "Completed";
  }

  if (lastEvent.status === "PENDING") {
    return "Processing";
  }

  return "Failed";
}
