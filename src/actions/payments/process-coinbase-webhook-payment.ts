"use server";

import { CoinbaseTimelineStatus } from "@/schemas/coinbase-payment-status.schema";
import { prisma } from "@/lib/prisma";
import { coinbaseGetLastEvent } from "@/lib/utils";
import paymentStatusChangedEvent from "../stream/payment-status-changed-event";

export async function processCoinbaseWebhookPayment(
  CoinbaseTimelineStatus: CoinbaseTimelineStatus,
) {
  const payment = await prisma.user_payments.findFirst({
    where: {
      provider_transaction_id: CoinbaseTimelineStatus.id, // coinbasse = user_payments.id / stripesession.id
    },
  });

  if (!payment) {
    throw new Error(`Payment id: ${CoinbaseTimelineStatus.id} not found`);
  }
  const lastEvent = coinbaseGetLastEvent(CoinbaseTimelineStatus.timeline);

  if (lastEvent.status === "COMPLETED" || lastEvent.status === "CONFIRMED") {
    if (payment.status === "Completed" || payment.status === "Canceled") {
      return {
        payment_status: payment.status,
        payment_id: payment.id,
        message: "payment.already_processed",
      };
    }
    await paymentStatusChangedEvent({
      payment_id: payment.id,
      new_status: "Completed",
    });

    return {
      payment_status: "Processing",
      payment_id: payment.id,
      message: "payment.processing_description",
    };
  }

  if (lastEvent.status === "FAILED") {
    await paymentStatusChangedEvent({
      payment_id: payment.id,
      new_status: "Failed",
    });
    return {
      payment_status: "Processing",
      payment_id: payment.id,
      message: "payment.failed_description",
    };
  }
  return {
    payment_status: payment.status,
    payment_id: payment.id,
    message: "payment.already_processed",
  };
}
