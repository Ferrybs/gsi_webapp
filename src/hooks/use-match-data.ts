// src/hooks/use-match-websocket.ts
import { useEffect, useState } from "react";
import { Match, MatchSchema } from "@/schemas/match.schema";
import {
  MatchPlayerStats,
  MatchPlayerStatsSchema,
} from "@/schemas/match-player-stats.schema";
import { useMatchWebSocket } from "./use-match-websocket";
import { getCurrentMatch } from "@/actions/match/get-current-match";
import { getMatchStatsByMatchId } from "@/actions/match/get-match-stats";
import { MatchPlayerRounds } from "@/schemas/match-player-rounds.schema";
import { getMatchRounds } from "@/actions/match/get-match-rounds";

export function useMatchData(streamerUserId: string) {
  const [matchData, setMatchData] = useState<Match | null>(null);
  const [statsData, setStatsData] = useState<MatchPlayerStats | null>(null);
  const [roundsData, setRoundsData] = useState<MatchPlayerRounds[] | null>(
    null,
  );
  const { matchWebSocketData, statsWebSocketData, roundsWebSocketData } =
    useMatchWebSocket(streamerUserId);

  useEffect(() => {
    if (!matchWebSocketData) {
      getCurrentMatch(streamerUserId).then((match) => {
        const result = MatchSchema.safeParse(match);
        if (result.success) {
          setMatchData(result.data);
        }
      });
    } else {
      setMatchData(matchWebSocketData);
    }
  }, [streamerUserId, matchData, matchWebSocketData]);

  useEffect(() => {
    if (!statsWebSocketData) {
      getMatchStatsByMatchId(matchData?.id || null).then((stats) => {
        const result = MatchPlayerStatsSchema.safeParse(stats);
        if (result.success) {
          setStatsData(result.data);
        }
      });
    } else {
      setStatsData(statsWebSocketData);
    }
  }, [matchData, statsWebSocketData]);

  useEffect(() => {
    if (!roundsWebSocketData) {
      getMatchRounds(statsData?.id || null).then((rounds) => {
        if (rounds) {
          setRoundsData(rounds);
        }
      });
    } else {
      setRoundsData(roundsWebSocketData);
    }
  }, [statsData, roundsWebSocketData]);

  return { matchData, statsData, roundsData };
}
