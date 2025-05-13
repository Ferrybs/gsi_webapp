import { z } from "zod";
import { team_side } from "../../generated/prisma";

export const MatchPlayerStatsSchema = z.object({
  id: z.string(),
  match_id: z.string(),
  round: z.number(),
  ct_score: z.number(),
  t_score: z.number(),
  team_side_name: z.nativeEnum(team_side),
  kills: z.number(),
  deaths: z.number(),
  assists: z.number(),
  started_at: z.preprocess(
    arg => (typeof arg === "string" ? new Date(arg) : arg),
    z.date()
  ),
  updated_at: z.preprocess(
    arg => (typeof arg === "string" ? new Date(arg) : arg),
    z.date()
  ),
});

export type MatchPlayerStats = z.infer<typeof MatchPlayerStatsSchema>;
