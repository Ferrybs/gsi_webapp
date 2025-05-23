import { z } from "zod";
import { map_mode, map_name, match_phase, match_status } from "@prisma/client";

export const MatchSchema = z.object({
  id: z.string(),
  streamer_user_id: z.string(),
  map_name: z.nativeEnum(map_name),
  mode_name: z.nativeEnum(map_mode),
  phase_name: z.nativeEnum(match_phase),
  status_name: z.nativeEnum(match_status),
  started_at: z.preprocess(
    (arg) => (typeof arg === "string" ? new Date(arg) : arg),
    z.date(),
  ),
  updated_at: z.preprocess(
    (arg) => (typeof arg === "string" ? new Date(arg) : arg),
    z.date(),
  ),
  ended_at: z.preprocess(
    (arg) =>
      typeof arg === "string"
        ? new Date(arg)
        : typeof arg === "undefined"
          ? null
          : arg,
    z.date().nullable(),
  ),
});

export type Match = z.infer<typeof MatchSchema>;
