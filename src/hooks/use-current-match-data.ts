"use client";
// src/hooks/use-match-websocket.ts
import { useEffect, useState } from "react";
import { Match, MatchSchema } from "@/schemas/match.schema";
import {
  MatchPlayerStats,
  MatchPlayerStatsSchema,
} from "@/schemas/match-player-stats.schema";
import { useMatchWebSocket } from "./use-match-websocket";
import { getCurrentMatchByStreamerId } from "@/actions/match/get-current-match";
import { getMatchStatsByMatchId } from "@/actions/match/get-match-stats";
import { MatchPlayerRounds } from "@/schemas/match-player-rounds.schema";
import { getMatchRounds } from "@/actions/match/get-match-rounds";

export function useCurrentMatchData(streamerUserId: string) {
  const [matchData, setMatchData] = useState<Match | null>(null);
  const [statsData, setStatsData] = useState<MatchPlayerStats | null>(null);
  const [roundsData, setRoundsData] = useState<MatchPlayerRounds[] | null>(
    null
  );
  const [hasLoadedMatch, setHasLoadedMatch] = useState(false);
  const [hasLoadedStats, setHasLoadedStats] = useState(false);
  const [hasLoadedRounds, setHasLoadedRounds] = useState(false);
  const { matchWebSocketData, statsWebSocketData, roundsWebSocketData } =
    useMatchWebSocket(streamerUserId);

  useEffect(() => {
    if (matchWebSocketData) {
      setMatchData(matchWebSocketData);
    } else if (!hasLoadedMatch) {
      getCurrentMatchByStreamerId(streamerUserId).then((match) => {
        const result = MatchSchema.safeParse(match);
        if (result.success) {
          setMatchData(result.data);
        }
        setHasLoadedMatch(true);
      });
    }
  }, [streamerUserId, matchWebSocketData, hasLoadedMatch]);

  useEffect(() => {
    if (statsWebSocketData) {
      setStatsData(statsWebSocketData);
    } else if (!hasLoadedStats && matchData?.id) {
      getMatchStatsByMatchId(matchData.id).then((stats) => {
        const result = MatchPlayerStatsSchema.safeParse(stats);
        if (result.success) {
          setStatsData(result.data);
        }
        setHasLoadedStats(true);
      });
    }
  }, [matchData, statsWebSocketData, hasLoadedStats]);

  useEffect(() => {
    if (roundsWebSocketData) {
      setRoundsData((prevRounds) => {
        if (!prevRounds) {
          return [roundsWebSocketData];
        }

        const existingIndex = prevRounds.findIndex(
          (round) => round.round_number === roundsWebSocketData.round_number
        );

        if (existingIndex !== -1) {
          // Update existing round
          const newRounds = [...prevRounds];
          newRounds[existingIndex] = roundsWebSocketData;
          return newRounds;
        } else {
          // Insert new round in correct position (descending order)
          const insertIndex = prevRounds.findIndex(
            (round) => round.round_number < roundsWebSocketData.round_number
          );

          if (insertIndex === -1) {
            // New round has the smallest number, add to end
            return [...prevRounds, roundsWebSocketData];
          } else {
            // Insert at the correct position
            const newRounds = [...prevRounds];
            newRounds.splice(insertIndex, 0, roundsWebSocketData);
            return newRounds;
          }
        }
      });
    } else if (!hasLoadedRounds && statsData?.id) {
      getMatchRounds(statsData.id).then((rounds) => {
        if (rounds) {
          setRoundsData(rounds);
        }
        setHasLoadedRounds(true);
      });
    }
  }, [statsData, roundsWebSocketData, hasLoadedRounds]);

  return { matchData, statsData, roundsData };
}
