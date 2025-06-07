"use server";

import { prisma } from "@/lib/prisma";
import { payment_status } from "@prisma/client";
import paymentStatusChangedEvent from "../stream/payment-status-changed-event";
import { stripe } from "@/lib/stripe";

export async function processStripeWebhookPayment(
  paymentIntentId: string,
  eventType: string
) {
  const payment = await prisma.user_payments.findFirst({
    where: { provider_transaction_id: paymentIntentId },
  });
  if (!payment) {
    throw new Error(`Payment session id: ${paymentIntentId} not found`);
  }

  const session = await stripe.paymentIntents.retrieve(paymentIntentId);
  if (!session) {
    throw new Error(
      `Payment session id: ${paymentIntentId} not found in Stripe`
    );
  }

  let newStatus: payment_status | null = null;
  if (eventType.startsWith("payment_intent")) {
    switch (session.status) {
      case "succeeded":
        newStatus = "Completed";
        break;
      case "canceled":
        newStatus = "Canceled";
        break;
      default:
        newStatus = null;
    }
  } else if (
    eventType.startsWith("charge.refund") ||
    eventType.startsWith("charge.dispute")
  ) {
    newStatus = "Refunded";
  }

  if (!newStatus) {
    return {
      payment_status: payment.status,
      payment_id: payment.id,
      message: "payment.ignored_event",
    };
  }

  if (
    payment.status === newStatus ||
    (payment.status === "Canceled" && newStatus === "Completed")
  ) {
    return {
      payment_status: payment.status,
      payment_id: payment.id,
      message: "payment.already_processed",
    };
  }

  await paymentStatusChangedEvent({
    payment_id: payment.id,
    new_status: newStatus,
  });

  const msg =
    newStatus === "Completed"
      ? "payment.processing_description"
      : newStatus === "Canceled"
        ? "payment.canceled_description"
        : "payment.canceled";

  return {
    payment_status: newStatus === "Completed" ? "Processing" : newStatus,
    payment_id: payment.id,
    message: msg,
  };
}
