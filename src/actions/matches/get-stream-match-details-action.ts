"use server";

import { prisma } from "@/lib/prisma";
import {
  MatchPlayerRounds,
  MatchPlayerRoundsSchema,
} from "@/schemas/match-player-rounds.schema";
import {
  MatchPlayerStats,
  MatchPlayerStatsSchema,
} from "@/schemas/match-player-stats.schema";
import { Match, MatchSchema } from "@/schemas/match.schema";
import { Streamer, StreamerSchema } from "@/schemas/streamer.schema";
import { ActionResponse } from "@/types/action-response";
import { z } from "zod";

// Input validation schema
const StreamMatchIdSchema = z.string().min(1, "Stream match ID is required");

type StreamMatchDetailsResponse = {
  streamer: Streamer;
  matchData: Match;
  statsData: MatchPlayerStats;
  roundsData: MatchPlayerRounds[];
};

export async function getStreamMatchDetailsAction(
  streamMatchId: string,
): Promise<ActionResponse<StreamMatchDetailsResponse>> {
  try {
    // Validate input
    const validatedStreamMatchId = StreamMatchIdSchema.parse(streamMatchId);

    const streamMatchData = await prisma.stream_matches.findUnique({
      where: { id: validatedStreamMatchId },
      include: {
        matches: {
          include: {
            match_player_stats: {
              include: {
                match_player_rounds: true,
              },
            },
          },
        },
        streamers: true,
      },
    });

    if (
      !streamMatchData ||
      !streamMatchData.matches ||
      !streamMatchData.matches.match_player_stats
    ) {
      return {
        success: false,
        error_message: "error.stream_match_not_found",
      };
    }
    return {
      success: true,
      data: {
        streamer: StreamerSchema.parse(streamMatchData.streamers),
        matchData: MatchSchema.parse(streamMatchData.matches),
        statsData: MatchPlayerStatsSchema.parse(
          streamMatchData.matches.match_player_stats,
        ),
        roundsData:
          streamMatchData.matches.match_player_stats.match_player_rounds
            .map((round) => MatchPlayerRoundsSchema.parse(round))
            .sort((a, b) => b.round_number - a.round_number),
      },
    };
  } catch (error) {
    console.error("Error fetching stream match details:", error);

    // Return null values on error
    return {
      error_message: "error.fetching_stream_match_details",
      success: false,
    };
  }
}
