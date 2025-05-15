"use server";

import { prisma } from "@/lib/prisma";
import { MatchPlayerStatsSchema } from "@/schemas/match-player-stats.schema";

export async function getMatchStatsByMatchId(match_id: string | null) {
  if (!match_id) {
    return null;
  }
  const stats = await prisma.match_player_stats.findUnique({
    where: {
      match_id: match_id,
    },
  });

  if (!stats) {
    return null;
  }

  return MatchPlayerStatsSchema.parse(stats);
}
