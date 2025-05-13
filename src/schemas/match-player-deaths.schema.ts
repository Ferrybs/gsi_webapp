

import { z } from "zod";
import { team_side } from "../../generated/prisma";

export const MatchPlayerDeathsSchema = z.object({
  id: z.number(),
  stats_id: z.string(),
  round_number: z.number(),
  team_side_name: z.nativeEnum(team_side),
  hp_before: z.number(),
  created_at: z.string(),
});

