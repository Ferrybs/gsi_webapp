import { z } from "zod";
export const EventPayloadSchema = z.object({
  match_event: z.enum([
    "match",
    "stats",
    "round",
    "kill",
    "death",
    "prediction",
    "bet",
  ]),
  data: z.string(),
});

export type EventPayload = z.infer<typeof EventPayloadSchema>;
