import Stripe from "stripe";

const stripeSecret = process.env.STRIPE_SECRET_KEY!;
if (!stripeSecret) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable");
}

export const stripe = new Stripe(stripeSecret, {
  apiVersion: "2025-05-28.basil",
});
