// app/api/stripe-webhook/route.ts

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { processStripeWebhookPayment } from "@/actions/payments/process-stripe-webhook-payment";
import { stripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  const buf = await request.arrayBuffer();
  const signature = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      Buffer.from(buf),
      signature,
      webhookSecret
    );
  } catch (err) {
    console.warn(
      "⚠️ [StripeWebhook] signature verification failed:",
      err ?? "Unknown error"
    );
    let message = "Webhook signature verification failed";
    if (err instanceof Error) {
      message = err.message;
    }
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const obj = event.data.object;
  let message = "";
  try {
    let sessionId: string | undefined;

    if (obj.object === "payment_intent") {
      const session = obj as Stripe.PaymentIntent;
      if (!session.id) {
        throw new Error("Payment intent ID is missing");
      }
      console.log("🔔 [StripeWebhook] Payment intent received:", session.id);
      sessionId = session.id;
    }
    if (obj.object === "dispute") {
      const session = obj as Stripe.Dispute;
      if (!session.payment_intent) {
        throw new Error("Dispute ID is missing");
      }
      console.log(
        "🔔 [StripeWebhook] Dispute received:",
        session.payment_intent
      );
      if (typeof session.payment_intent === "string") {
        sessionId = session.payment_intent;
      } else if (session.payment_intent.id) {
        sessionId = session.payment_intent.id;
      }
    }
    if (obj.object === "refund") {
      const session = obj as Stripe.Refund;
      if (!session.payment_intent) {
        throw new Error("Refund ID is missing");
      }
      if (typeof session.payment_intent === "string") {
        sessionId = session.payment_intent;
      } else if (session.payment_intent.id) {
        sessionId = session.payment_intent.id;
      }
    }
    if (obj.object === "charge") {
      const session = obj as Stripe.Charge;
      if (!session.payment_intent) {
        throw new Error("Charge ID is missing");
      }
      if (typeof session.payment_intent === "string") {
        sessionId = session.payment_intent;
      } else if (session.payment_intent.id) {
        sessionId = session.payment_intent.id;
      }
    }
    if (!sessionId) {
      throw new Error("Session ID is missing");
    }
    console.log("🔔 [StripeWebhook] Payment intent received:", sessionId);
    const result = await processStripeWebhookPayment(sessionId, event.type);
    console.log("✅ [StripeWebhook] processed:", result);
  } catch (err) {
    message = "Error processing Stripe webhook";
    if (err instanceof Error) {
      message = err.message;
    }
    console.error("❌ [StripeWebhook] Error processing:", message);
  }

  return NextResponse.json({ received: true, message }, { status: 200 });
}
