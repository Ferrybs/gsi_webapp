import { z } from "zod";
import { round_conclusion, team_side } from "@prisma/client";

export const MatchPlayerRoundsSchema = z.object({
  stats_id: z.string().uuid(),
  round_number: z.number().int(),
  team_side_name: z.nativeEnum(team_side),
  kills: z.number().int(),
  hs_kills: z.number().int(),
  health: z.number().int(),
  equipment_val: z.number().int(),
  round_conclusion_name: z.nativeEnum(round_conclusion).nullable(),
  created_at: z.preprocess(
    (arg) => (typeof arg === "string" ? new Date(arg) : arg),
    z.date(),
  ),
  updated_at: z.preprocess(
    (arg) => (typeof arg === "string" ? new Date(arg) : arg),
    z.date(),
  ),
});

export type MatchPlayerRounds = z.infer<typeof MatchPlayerRoundsSchema>;
