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
    "end",
  ]),
  data: z.string(),
});

export type EventPayload = z.infer<typeof EventPayloadSchema>;
