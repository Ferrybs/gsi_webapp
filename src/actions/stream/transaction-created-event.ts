"use server";
import { redis } from "@/lib/redis";
import { StreamEvent, StreamEventType } from "@/types/stream-actions";

export default async function transactionCreatedEvent(transaction: {
  id: string;
}) {
  const event: StreamEvent = {
    type: StreamEventType.EventTransactionCreated,
    data: {
      transaction_id: transaction.id,
    },
  };
  await redis.xadd(
    process.env.REDIS_STREAM_NAME!,
    "*",
    "msg",
    JSON.stringify(event),
  );
}
