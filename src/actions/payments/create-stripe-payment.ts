"use server";

import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { createDefaultPayment } from "./create-default-payment";
import {
  CreatePayment,
  CreatePaymentResponse,
} from "@/schemas/handle-payment.schema";
import { ActionError } from "@/types/action-error";
import { Users } from "@/schemas/users.schema";

export async function createStripePayment(
  user: Users,
  data: CreatePayment,
): Promise<CreatePaymentResponse> {
  try {
    const { payment, pointPackage } = await createDefaultPayment(user, data);
    // Map currency codes to Stripe currency codes
    if (pointPackage.currency === "USDC") {
      throw new Error("USDC payments are not supported with Stripe");
    }
    const stripeCurrency = pointPackage.currency.toLowerCase();

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: stripeCurrency,
            product_data: {
              name: `${pointPackage.name} - ${pointPackage.points_amount} CS2Bits`,
              description: `${pointPackage.bonus_points.gt(0) ? `+${pointPackage.bonus_points} bonus points` : "No bonus points"}`,
            },
            unit_amount_decimal: pointPackage.price.mul(100).toString(),
          },
          quantity: 1,
        },
      ],
      allow_promotion_codes: true,
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/payment/success?payment_id=${payment.id}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/payment/cancel?payment_id=${payment.id}`,
      metadata: {
        payment_id: payment.id,
        user_id: user.id,
      },
    });

    await prisma.user_payments.update({
      where: {
        id: payment.id,
      },
      data: {
        provider_transaction_id: session.id,
      },
    });

    if (!session.url) {
      throw new ActionError("error.stripe_session_creation_failed");
    }
    return { url: session.url, paymentId: payment.id };
  } catch (error) {
    console.error("Error creating Stripe payment:", error);
    if (error instanceof ActionError) {
      throw error;
    }
    throw new ActionError("error.payment_creation_failed");
  }
}
