"use server";
import { prisma } from "@/lib/prisma";
import { MatchPlayerRoundsSchema } from "@/schemas/match-player-rounds.schema";

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

  if (!rounds) {
    return null;
  }

  return rounds.map((round) => MatchPlayerRoundsSchema.parse(round));
}
