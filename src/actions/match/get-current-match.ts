"use server";

import { prisma } from "@/lib/prisma";
import { MatchSchema } from "@/schemas/match.schema";

export async function getCurrentMatch(streamerUserId: string) {
  const match = await prisma.matches.findFirst({
    where: {
      streamer_user_id: streamerUserId,
      AND: [
        {
          ended_at: null,
        },
      ],
    },
  });
  if (!match) {
    return null;
  }
  return MatchSchema.parse(match);
}
