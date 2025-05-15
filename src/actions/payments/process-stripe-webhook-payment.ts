"use server";

import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { payment_status } from "@prisma/client";

export async function processStripeWebhookPayment(
  session: Stripe.Checkout.Session,
  eventType: string,
) {
  // 1) Busque o pagamento pelo ID da sessão de checkout
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

  // 3) Se não for um evento que muda o status, apenas retorne sem alterações
  if (!newStatus) {
    return {
      payment_status: payment.status,
      payment_id: payment.id,
      message: "payment.ignored_event",
    };
  }

  // 4) Se já estiver no status desejado (ou for cancelado > completed), não duplique
  if (
    payment.status === newStatus ||
    // opcional: não permita reabrir falhas
    (payment.status === "Canceled" && newStatus === "Completed")
  ) {
    return {
      payment_status: payment.status,
      payment_id: payment.id,
      message: "payment.already_processed",
    };
  }

  // 5) Atualize o status na base
  await prisma.user_payments.update({
    where: { id: payment.id },
    data: { status: newStatus },
  });

  // 6) Retorne o resultado
  const msg =
    newStatus === "Completed"
      ? "payment.processed_successfully"
      : newStatus === "Failed"
        ? "payment.failed_description"
        : "payment.canceled";

  return {
    payment_status: newStatus,
    payment_id: payment.id,
    message: msg,
  };
}
