import { z } from "zod";
import { team_side } from "../../generated/prisma";

export const MatchPlayerKillsSchema = z.object({
  id: z.number(),
  stats_id: z.string(),
  round_number: z.number(),
  team_side_name: z.nativeEnum(team_side),
  is_headshot: z.boolean(),
  created_at: z.string(),
});

export type MatchPlayerKills = z.infer<typeof MatchPlayerKillsSchema>;
