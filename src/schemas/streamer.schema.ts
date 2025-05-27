import { z } from "zod";
import { stream_provider } from "@prisma/client";

export const StreamUrlSchema = z.object({
  url: z.string(),
  streamer_id: z.string(),
  stream_provider_name: z.nativeEnum(stream_provider),
});

export const StreamerSchema = z.object({
  stream_urls: z.array(StreamUrlSchema).optional(),
  id: z.string(),
  user_id: z.string(),
  username_id: z.string(),
  avatar_url: z.string().nullable(),
  display_name: z.string().min(4).max(30).nullable(),
});

export type StreamUrl = z.infer<typeof StreamUrlSchema>;
export type Streamer = z.infer<typeof StreamerSchema>;
