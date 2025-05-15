// app/api/stripe-webhook/route.ts

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { processStripeWebhookPayment } from "@/actions/payments/process-stripe-webhook-payment";
import stripe from "@/lib/stripe";

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  const buf = await request.arrayBuffer();
  const signature = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      Buffer.from(buf),
      signature,
      webhookSecret,
    );
  } catch (err: any) {
    console.warn(
      "⚠️ [StripeWebhook] signature verification failed:",
      err.message,
    );
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  let message = "";
  try {
    const result = await processStripeWebhookPayment(session, event.type);
    console.log("✅ [StripeWebhook] processed:", result);
  } catch (err: any) {
    console.error("❌ [StripeWebhook] Error processing:", err.message);
    message = err.message;
  }

  return NextResponse.json({ received: true, message }, { status: 200 });
}
