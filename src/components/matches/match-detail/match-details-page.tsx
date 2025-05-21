"use client";

import { RoundList } from "./round-list";
import { MatchHeader } from "./match-header";
import { Streamer } from "@/schemas/streamer.schema";
import { useEffect } from "react";
import { PredictionsList } from "@/components/predictions/predictions-list";
import { getCurrentMatchByStreamerId } from "@/actions/match/get-current-match";
import { useCurrentMatchData } from "@/hooks/use-current-match-data";

interface MatchDetailsPageProps {
  streamer: Streamer | null;
}

export default function MatchDetailsPage({ streamer }: MatchDetailsPageProps) {
  if (!streamer) {
    return <MatchDetailsLoading />;
  }
  const { matchData, statsData, roundsData, predictionsData } =
    useCurrentMatchData(streamer.id);

  useEffect(() => {
    const i = setInterval(() => {
      if (matchData != null) {
        getCurrentMatchByStreamerId(streamer.id).then((m) => {
          if (m == null) {
            location.reload();
          }
        });
      }
    }, 2000);

    return () => {
      clearInterval(i);
    };
  }, [matchData, statsData]);

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
