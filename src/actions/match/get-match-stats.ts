"use server";

import { prisma } from "@/lib/prisma";

export async function getMatchStatsByMatchId(match_id: string | null) {
  if (!match_id) {
    return null;
  }
  const stats = await prisma.match_player_stats.findUnique({
    where: {
      match_id: match_id,
    },
  });

  return stats;
}
