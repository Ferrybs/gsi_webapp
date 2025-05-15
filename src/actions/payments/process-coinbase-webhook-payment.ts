"use server";

import {
  CoinbaseTimelineStatus,
  TimelineStatus,
} from "@/schemas/coinbase-payment-status.schema";
import { prisma } from "@/lib/prisma";
import { coinbaseGetLastEvent } from "@/lib/utils";

export async function processCoinbaseWebhookPayment(
  CoinbaseTimelineStatus: CoinbaseTimelineStatus,
) {
  const payment = await prisma.user_payments.findFirst({
    where: {
      provider_transaction_id: CoinbaseTimelineStatus.id,
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

    await prisma.user_payments.update({
      where: { id: payment.id },
      data: { status: "Completed" },
    });
    return {
      payment_status: "Completed",
      payment_id: payment.id,
      message: "payment.processed_successfully",
    };
  }

  if (lastEvent.status === "FAILED") {
    await prisma.user_payments.update({
      where: { id: payment.id },
      data: { status: "Failed" },
    });
    return {
      payment_status: "Failed",
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
