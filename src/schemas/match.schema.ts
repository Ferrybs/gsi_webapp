import { z } from "zod";
import { map_mode, map_name, match_phase, match_status } from "@prisma/client";
import { stringToDate } from "./helper.schema";

export const MatchSchema = z.object({
  id: z.string(),
  streamer_user_id: z.string(),
  map_name: z.nativeEnum(map_name),
  mode_name: z.nativeEnum(map_mode),
  phase_name: z.nativeEnum(match_phase),
  status_name: z.nativeEnum(match_status),
  started_at: stringToDate,
  updated_at: stringToDate,
  ended_at: stringToDate.nullable(),
});

export type Match = z.infer<typeof MatchSchema>;
