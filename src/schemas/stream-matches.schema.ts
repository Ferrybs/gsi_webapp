import { z } from "zod";
import { stream_match_status } from "../../generated/prisma";

export const StreamMatchesSchema = z.object({
  id: z.string(),
  match_id: z.string(),
  streamer_id: z.string(),
  match_status: z.nativeEnum(stream_match_status),
  created_at: z.string(),
  updated_at: z.string(),
});

export type StreamMatches = z.infer<typeof StreamMatchesSchema>;