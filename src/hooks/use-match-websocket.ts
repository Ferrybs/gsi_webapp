import { getWsTokenAction } from "@/actions/ws/get-ws-token-action";
import {
  MatchPlayerRounds,
  MatchPlayerRoundsSchema,
} from "@/schemas/match-player-rounds.schema";
import {
  MatchPlayerStats,
  MatchPlayerStatsSchema,
} from "@/schemas/match-player-stats.schema";
import { Match, MatchSchema } from "@/schemas/match.schema";
import { useEffect, useState } from "react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

type EventPayload = {
  match_event: "match" | "stats";
  data: string;
};

export function useMatchWebSocket(streamerUserId: string) {
  const ws = useRef<WebSocket | null>(null);
  const { t } = useTranslation();
  const [wssToken, setWssToken] = useState<string | null>(null);
  const [matchWebSocketData, setMatchWebSocketData] = useState<Match | null>(
    null,
  );
  const [statsWebSocketData, setStatsWebSocketData] =
    useState<MatchPlayerStats | null>(null);
  const [roundsWebSocketData, setRoundsWebSocketData] = useState<
    MatchPlayerRounds[] | null
  >(null);
  useEffect(() => {
    async function fetchToken() {
      setWssToken(await getWsTokenAction());
    }
    fetchToken();
  }, []);
  useEffect(() => {
    if (!wssToken) return;
    const url = `${process.env.NEXT_PUBLIC_WS_URL!}/match_events?token=${wssToken}&streamer=${streamerUserId}`;
    const wsInstance = new WebSocket(url);
    ws.current = wsInstance;
    wsInstance.onmessage = (event) => {
      if (event.data === "ping") {
        wsInstance.send("pong");
        return;
      }
      const eventPayload = JSON.parse(event.data) as EventPayload;
      if (eventPayload.match_event === "match") {
        const json = JSON.parse(eventPayload.data);
        const result = MatchSchema.safeParse(json);
        if (result.success) {
          setMatchWebSocketData(result.data);
        } else {
          console.error("Invalid match data:", result.error);
          toast.error(t("error.match_update"));
        }
      } else if (eventPayload.match_event === "stats") {
        const json = JSON.parse(eventPayload.data);
        const result = MatchPlayerStatsSchema.safeParse(json);
        if (result.success) {
          setStatsWebSocketData(result.data);
        } else {
          console.error("Invalid match data:", result.error);
          toast.error(t("error.match_update"));
        }
      } else if (eventPayload.match_event === "round") {
        const json = JSON.parse(eventPayload.data);
        const result = MatchPlayerRoundsSchema.safeParse(json);
        if (result.success) {
          const rounds = roundsWebSocketData?.filter(
            (round) => round.round_number !== result.data.round_number,
          );
          if (rounds) {
            rounds.push(result.data);
            rounds.sort((a, b) => b.round_number - a.round_number);
            setRoundsWebSocketData(rounds);
          } else {
            setRoundsWebSocketData([result.data]);
          }
        } else {
          console.error("Invalid match data:", result.error);
          toast.error(t("error.match_update"));
        }
      }
    };
  }, [wssToken, streamerUserId]);

  return { matchWebSocketData, statsWebSocketData, roundsWebSocketData };
}
