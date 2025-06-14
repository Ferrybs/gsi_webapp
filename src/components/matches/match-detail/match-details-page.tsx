"use client";

import { RoundList } from "./round-list";
import { MatchHeader } from "./match-header";
import { Streamer } from "@/schemas/streamer.schema";
import { useQuery } from "@tanstack/react-query";
import { PredictionSchema } from "@/schemas/prediction.schema";
import { getPredictionsAction } from "@/actions/predictions/get-predictions-action";
import { Match } from "@/schemas/match.schema";
import { MatchPlayerStats } from "@/schemas/match-player-stats.schema";
import { MatchPlayerRounds } from "@/schemas/match-player-rounds.schema";
import { useTranslation } from "react-i18next";
import { PredictionsList } from "@/components/predictions/predictions-list";

interface MatchDetailsPageProps {
  streamer: Streamer | null;
  matchData: Match | null;
  statsData: MatchPlayerStats | null;
  roundsData: MatchPlayerRounds[] | null;
}

export default function MatchDetailsPage({
  streamer,
  matchData,
  statsData,
  roundsData,
}: MatchDetailsPageProps) {
  const { t } = useTranslation();
  const { data: predictionsData = [] } = useQuery({
    queryKey: ["prediction", matchData?.id],
    queryFn: async () => {
      if (!matchData) return [];
      const pred = await getPredictionsAction(matchData.id);
      return pred.map((p) => PredictionSchema.parse(p));
    },
    enabled: matchData != null,
    refetchOnWindowFocus: false,
  });

  if (!streamer) {
    return <MatchDetailsLoading />;
  }
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Coluna principal */}
      <div className="lg:col-span-8 space-y-6">
        <MatchHeader
          matchData={matchData}
          statsData={statsData}
          streamer={streamer}
        />
        <RoundList rounds={roundsData || []} streamer={streamer} t={t} />
      </div>

      <div className="lg:col-span-4 space-y-6">
        <PredictionsList
          streamer={streamer}
          predictions={predictionsData}
          currentRound={statsData?.round || 0}
        />
      </div>
    </div>
  );
}

function MatchDetailsLoading() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8 space-y-6">
        <div className="space-y-4 animate-pulse">
          <div className="flex justify-between items-center">
            <div className="h-10 w-64 bg-muted rounded-md" />
            <div className="h-6 w-20 bg-muted rounded-md" />
          </div>
          <div className="h-64 w-full bg-muted rounded-lg" />
        </div>
        <div className="h-80 w-full bg-muted rounded-lg" />
      </div>
      <div className="lg:col-span-4 space-y-6">
        <div className="h-96 w-full bg-muted rounded-lg" />
        <div className="h-80 w-full bg-muted rounded-lg" />
      </div>
    </div>
  );
}
