"use server";
import { prisma } from "@/lib/prisma";

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

  return streamer;
}
