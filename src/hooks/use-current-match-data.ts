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
    null,
  );
  const { matchWebSocketData, statsWebSocketData, roundsWebSocketData } =
    useMatchWebSocket(streamerUserId);

  useEffect(() => {
    if (matchWebSocketData === null) {
      getCurrentMatchByStreamerId(streamerUserId).then((match) => {
        const result = MatchSchema.safeParse(match);
        if (result.success) {
          setMatchData(result.data);
        }
      });
    } else {
      setMatchData(matchWebSocketData);
    }
  }, [streamerUserId, matchWebSocketData]);

  useEffect(() => {
    if (statsWebSocketData === null) {
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
    if (roundsWebSocketData === null) {
      getMatchRounds(statsData?.id || null).then((rounds) => {
        if (rounds) {
          setRoundsData(rounds);
        }
      });
    } else if (roundsWebSocketData) {
      // roundsWebSocketData is a single round, append/update it
      const roundsDataFilter = roundsData?.filter(
        (round) => round.round_number !== roundsWebSocketData.round_number,
      );
      if (roundsDataFilter) {
        roundsDataFilter.push(roundsWebSocketData);
        setRoundsData(
          roundsDataFilter.sort((a, b) => b.round_number - a.round_number),
        );
      } else {
        setRoundsData([roundsWebSocketData]);
      }
    }
  }, [statsData, roundsWebSocketData]);

  return { matchData, statsData, roundsData };
}
