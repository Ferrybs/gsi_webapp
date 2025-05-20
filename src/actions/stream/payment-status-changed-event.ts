"use server";
import { payment_status } from "@prisma/client";
import { redis } from "@/lib/redis";
import { StreamEvent, StreamEventType } from "@/types/stream-actions";

export default async function paymentStatusChangedEvent(paymentStatus: {
  payment_id: string;
  new_status: payment_status;
}) {
  const event: StreamEvent = {
    type: StreamEventType.EventPaymentStatusChanged,
    data: paymentStatus,
  };
  const res = await redis.xadd(
    process.env.REDIS_GSI_STREAM!,
    "*",
    "msg",
    JSON.stringify(event),
  );
  if (res) {
    console.log("Payment status changed event added to stream:", res);
  } else {
    console.error("Failed to add payment status changed event to stream");
  }
}
