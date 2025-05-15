"use server";

import { prisma } from "@/lib/prisma";

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

  return match;
}
