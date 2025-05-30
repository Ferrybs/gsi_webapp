"use server";

import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { payment_status } from "@prisma/client";
import paymentStatusChangedEvent from "../stream/payment-status-changed-event";

export async function processStripeWebhookPayment(
  session: Stripe.Checkout.Session,
  eventType: string,
) {
  const payment = await prisma.user_payments.findFirst({
    where: { provider_transaction_id: session.id },
  });
  if (!payment) {
    throw new Error(`Payment session id: ${session.id} not found`);
  }

  let newStatus: payment_status | null = null;
  switch (eventType) {
    case "checkout.session.completed":
      session.payment_status === "paid"
        ? (newStatus = "Completed")
        : (newStatus = "Failed");
      break;
    case "checkout.session.async_payment_succeeded":
      newStatus = "Completed";
      break;
    case "checkout.session.async_payment_failed":
      newStatus = "Failed";
      break;
    case "checkout.session.expired":
      session.payment_status === "paid"
        ? (newStatus = "Completed")
        : (newStatus = "Canceled");
      break;
    default:
      newStatus = null;
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
      : newStatus === "Failed"
        ? "payment.failed_description"
        : "payment.canceled";

  return {
    payment_status: newStatus === "Completed" ? "Processing" : newStatus,
    payment_id: payment.id,
    message: msg,
  };
}
