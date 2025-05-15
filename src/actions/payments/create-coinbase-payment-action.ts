"use server";

import { prisma } from "@/lib/prisma";
import {
  CreateDefaultPayment,
  createDefaultPayment,
} from "./create-default-payment";
import { updateUserPaymentStatusAction } from "./update-user-payment-status-action";
import { CoinbaseTimelineStatusSchema } from "@/schemas/coinbase-payment-status.schema";

export async function createCoinbasePaymentAction(data: CreateDefaultPayment) {
  try {
    const { payment, pointPackage } = await createDefaultPayment(data);

    const coinbaseResponse = await fetch(
      "https://api.commerce.coinbase.com/charges",
      {
        method: "POST",
        body: JSON.stringify({
          buyer_locale: pointPackage.currency,
          local_price: {
            amount:
              process.env.NODE_ENV === "development"
                ? "1"
                : pointPackage.price.toString(),
            currency:
              process.env.NODE_ENV === "development"
                ? "BRL"
                : pointPackage.currency,
          },
          pricing_type: "fixed_price",
          cancel_url: `${process.env.NEXTAUTH_URL}/payment/cancel?payment_id=${payment.id}`,
          redirect_url: `${process.env.NEXTAUTH_URL}/payment/success?payment_id=${payment.id}`,
        }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-CC-Version": "2018-03-22",
          "X-CC-Api-Key": process.env.COINBASE_API_KEY!,
        },
      },
    );
    if (!coinbaseResponse.ok) {
      console.error(
        "Failed to create Coinbase payment",
        await coinbaseResponse.json(),
      );
      await updateUserPaymentStatusAction(payment.id, "Failed");
      throw new Error("Failed to create Coinbase payment");
    }
    const coinbaseData = await coinbaseResponse.json();
    const coinBasePaymentStatus = CoinbaseTimelineStatusSchema.safeParse(
      coinbaseData.data,
    );

    if (!coinBasePaymentStatus.success) {
      await updateUserPaymentStatusAction(payment.id, "Failed");
      throw new Error("Failed to create Coinbase payment");
    }

    // Update payment with provider transaction ID
    await prisma.user_payments.update({
      where: {
        id: payment.id,
      },
      data: {
        provider_transaction_id: coinBasePaymentStatus.data.id,
      },
    });

    return {
      success: true,
      url: coinBasePaymentStatus.data.hosted_url,
      paymentId: payment.id,
    };
  } catch (error) {
    console.error("Error creating Coinbase payment:", error);
    return { success: false, error: "Failed to create payment" };
  }
}
