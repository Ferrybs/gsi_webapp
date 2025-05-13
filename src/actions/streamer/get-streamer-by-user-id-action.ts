"use server";

import prisma from "@/lib/prisma";

export async function getStreamerByUserIdAction(user_id: string) {
  const streamer = await prisma.streamers.findUnique({
    where: {
      user_id: user_id,
    },
    include: {
      stream_urls: true,
    },
  });
  return streamer;
}