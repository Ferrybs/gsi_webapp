"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUserAction } from "../user/get-current-user-action";
import stripe from "@/lib/stripe";
import { payment_status, user_payments } from "@prisma/client";
import { CoinbaseTimelineStatusSchema } from "@/schemas/coinbase-payment-status.schema";
import { coinbaseGetLastEvent } from "@/lib/utils";

export async function processUserPaymentSuccessAction(paymentId: string) {
  try {
    const user = await getCurrentUserAction();

    if (!user?.id) {
      throw new Error("User not authenticated");
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

    if (
      payment.status === "Completed" ||
      payment.status === "Canceled" ||
      payment.status === "Failed" ||
      payment.status === "Refunded"
    ) {
      return {
        payment_status: payment.status,
        message: "payment.already_processed",
      };
    }

    let paymentStatus: payment_status;

    switch (payment.provider) {
      case "Stripe":
        paymentStatus = await processStripePaymentSuccessAction(
          payment.provider_transaction_id,
        );
        break;
      case "Coinbase":
        paymentStatus = await processCoinbasePaymentSuccessAction(payment);
        break;
    }

    if (!paymentStatus) {
      return {
        message: "error.payment_status_not_found",
      };
    }

    await prisma.user_payments.update({
      where: {
        id: payment.id,
      },
      data: {
        status: paymentStatus,
      },
    });

    return {
      payment_status: paymentStatus,
      message: "payment.processed_completely",
    };
  } catch (error) {
    console.error("Error processing payment success:", error);
    return {
      error: "error.failed_to_process_payment",
    };
  }
}

async function processStripePaymentSuccessAction(sessionID: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionID);

  if (!session || session.payment_status !== "paid") {
    return "Failed";
  }
  return "Completed";
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
    },
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
