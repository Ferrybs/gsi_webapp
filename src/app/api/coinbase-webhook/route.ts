// app/api/coinbase-webhook/route.ts

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { z } from "zod";
import { CoinbaseTimelineStatusSchema } from "@/schemas/coinbase-payment-status.schema";
import { processCoinbaseWebhookPayment } from "@/actions/payments/process-coinbase-webhook-payment";

const CoinbaseWebhookSchema = z.object({
  id: z.string(),
  event: z.object({
    type: z.enum([
      "charge:created",
      "charge:pending",
      "charge:confirmed",
      "charge:failed",
    ]),
    data: CoinbaseTimelineStatusSchema,
  }),
});

export async function POST(request: NextRequest) {
  const secret = process.env.COINBASE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("Missing COINBASE_WEBHOOK_SECRET");
    return NextResponse.json(
      { error: "Server misconfiguration" },
      { status: 500 },
    );
  }

  const signature = request.headers.get("X-CC-WEBHOOK-SIGNATURE");
  if (!signature) {
    return NextResponse.json({ error: "No signature header" }, { status: 400 });
  }

  const rawBody = await request.text();

  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  if (signature !== expected) {
    console.warn(" ⚠️ Invalid signature:", signature, "expected:", expected);
    console.warn(" ⚠️ Raw Body: ", rawBody);
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  try {
    const payload = JSON.parse(rawBody);
    console.log("Coinbase Webhook Payload", payload);
    const result = CoinbaseWebhookSchema.safeParse(payload);
    try {
      if (result.success && result.data.event.type !== "charge:created") {
        const response = await processCoinbaseWebhookPayment(
          result.data.event.data,
        );
        console.log("[processCoinbaseWebhookPayment] Response: ", response);
      }
    } catch (err) {
      console.error("Error processing event", err);
    } finally {
      return NextResponse.json(
        `Received event id=${result.data?.id}, type=${result.data?.event.type}`,
        { status: 200 },
      );
    }
  } catch (err) {
    console.error("Invalid JSON payload", err);
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}
