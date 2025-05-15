"use server";

import { prisma } from "@/lib/prisma";
import { StreamerSchema } from "@/schemas/streamer.schema";

export async function getStreamerByUserIdAction(user_id: string) {
  const streamer = await prisma.streamers.findUnique({
    where: {
      user_id: user_id,
    },
    include: {
      stream_urls: true,
    },
  });

  if (!streamer) {
    return null;
  }

  return StreamerSchema.parse(streamer);
}
