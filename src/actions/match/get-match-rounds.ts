"use server";
import { prisma } from "@/lib/prisma";

export async function getMatchRounds(statsId: string | null) {
  if (!statsId) {
    return null;
  }
  const rounds = await prisma.match_player_rounds.findMany({
    where: {
      stats_id: statsId,
    },
    orderBy: {
      round_number: "desc",
    },
  });

  return rounds;
}
