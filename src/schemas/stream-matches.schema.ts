import { z } from "zod";
import { stream_match_status } from "@prisma/client";

export const StreamMatchSchema = z.object({
  id: z.string(),
  match_id: z.string(),
  streamer_id: z.string(),
  match_status: z.nativeEnum(stream_match_status),
  created_at: z.preprocess(
    (arg) =>
      typeof arg === "string" ? new Date(arg) : arg instanceof Date ? arg : arg,
    z.date(),
  ),
  updated_at: z.preprocess(
    (arg) =>
      typeof arg === "string" ? new Date(arg) : arg instanceof Date ? arg : arg,
    z.date(),
  ),
});

export type StreamMatch = z.infer<typeof StreamMatchSchema>;
