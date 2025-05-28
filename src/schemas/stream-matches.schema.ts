import { z } from "zod";
import { stream_match_status } from "@prisma/client";
import { stringToDate } from "./helper.schema";

export const StreamMatchSchema = z.object({
  id: z.string(),
  match_id: z.string(),
  streamer_id: z.string(),
  match_status: z.nativeEnum(stream_match_status),
  created_at: stringToDate,
  updated_at: stringToDate,
});

export type StreamMatch = z.infer<typeof StreamMatchSchema>;
