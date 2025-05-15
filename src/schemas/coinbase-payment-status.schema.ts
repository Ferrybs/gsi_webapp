import { z } from "zod";

export const TimelineStatusSchema = z.object({
  status: z.enum([
    "NEW",
    "SIGNED",
    "PENDING",
    "COMPLETED",
    "CONFIRMED",
    "FAILED",
  ]),
  time: z.string().datetime(),
});

export const CoinbaseTimelineStatusSchema = z.object({
  id: z.string(),
  hosted_url: z.string().url(),
  timeline: z.array(TimelineStatusSchema),
});

export type CoinbaseTimelineStatus = z.infer<
  typeof CoinbaseTimelineStatusSchema
>;
export type TimelineStatus = z.infer<typeof TimelineStatusSchema>;
