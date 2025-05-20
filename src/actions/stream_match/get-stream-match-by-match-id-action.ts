import { prisma } from "@/lib/prisma";

export default async function getStreamMatchByMatchIdAction(matchId: string) {
  try {
    const streamMatch = await prisma.stream_matches.findUnique({
      where: {
        id: matchId,
      },
    });

    if (!streamMatch) {
      throw new Error("Stream match not found");
    }

    return streamMatch;
  } catch (error) {
    console.error("Error fetching stream match:", error);
    throw error;
  }
}
