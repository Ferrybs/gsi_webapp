import Stripe from "stripe";

const stripeSecret = process.env.STRIPE_SECRET_KEY!;
if (!stripeSecret) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable");
}

declare global {
  var __stripe__: Stripe | undefined;
}

const stripe: Stripe =
  globalThis.__stripe__ ||
  new Stripe(stripeSecret, {
    apiVersion: "2025-04-30.basil",
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__stripe__ = stripe;
}

export default stripe;
