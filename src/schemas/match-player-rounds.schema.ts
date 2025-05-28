import { z } from "zod";
import { round_conclusion, team_side } from "@prisma/client";
import { stringToDate } from "./helper.schema";

export const MatchPlayerRoundsSchema = z.object({
  stats_id: z.string().uuid(),
  round_number: z.number().int(),
  team_side_name: z.nativeEnum(team_side),
  kills: z.number().int(),
  hs_kills: z.number().int(),
  health: z.number().int(),
  equipment_val: z.number().int(),
  round_conclusion_name: z.nativeEnum(round_conclusion).nullable(),
  created_at: stringToDate,
  updated_at: stringToDate,
});

export type MatchPlayerRounds = z.infer<typeof MatchPlayerRoundsSchema>;
