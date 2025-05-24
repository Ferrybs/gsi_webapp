"use client";

import { RoundList } from "./round-list";
import { MatchHeader } from "./match-header";
import { Streamer } from "@/schemas/streamer.schema";
import { useEffect, useState } from "react";
import { PredictionsList } from "@/components/predictions/predictions-list";
import { useCurrentMatchData } from "@/hooks/use-current-match-data";
import { useQuery } from "@tanstack/react-query";
import { Prediction, PredictionSchema } from "@/schemas/prediction.schema";
import { getPredictionsAction } from "@/actions/predictions/get-predictions-action";

interface MatchDetailsPageProps {
  streamer: Streamer | null;
}

export default function MatchDetailsPage({ streamer }: MatchDetailsPageProps) {
  if (!streamer) {
    return <MatchDetailsLoading />;
  }
  const { matchData, statsData, roundsData } = useCurrentMatchData(streamer.id);
  const [predictionsData, setPredictionsData] = useState<Prediction[]>([]);

  const {
    data: predictionsDataQuery,
    isFetching,
    isRefetching,
  } = useQuery({
    queryKey: ["prediction"],
    queryFn: async () => {
      if (!matchData) return [];
      const pred = await getPredictionsAction(matchData.id);
      return pred.map((p) => PredictionSchema.parse(p));
    },
    enabled: matchData != null,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (predictionsDataQuery) {
      setPredictionsData(predictionsDataQuery);
    }
  }, [predictionsDataQuery, isFetching, isRefetching]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Coluna principal */}
      <div className="lg:col-span-8 space-y-6">
        <MatchHeader
          matchData={matchData}
          statsData={statsData}
          streamer={streamer}
        />
        <RoundList rounds={roundsData || []} streamer={streamer} />
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
