"use server";
import { prisma } from "@/lib/prisma";
import { StreamerSchema } from "@/schemas/streamer.schema";

export async function getStreamerByUsernameAction(streamerID: string) {
  const streamer = await prisma.streamers.findFirst({
    where: {
      username_id: {
        equals: streamerID,
        mode: "insensitive",
      },
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
