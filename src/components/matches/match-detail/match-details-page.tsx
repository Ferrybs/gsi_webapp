"use client";

import { RoundList } from "./round-list";
import { MatchHeader } from "./match-header";
import { Streamer } from "@/schemas/streamer.schema";
import { useMatchData } from "@/hooks/use-match-data";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import { PredictionsCard } from "./predictions-card";

interface MatchDetailsPageProps {
  streamer: Streamer | null;
}

export default function MatchDetailsPage({ streamer }: MatchDetailsPageProps) {
  if (!streamer) {
    return <MatchDetailsLoading />;
  }
  const { matchData, statsData, roundsData } = useMatchData(streamer.id);

  useEffect(() => {
    if (
      matchData?.status_name === "Invalid" ||
      matchData?.status_name === "Abandoned" ||
      matchData?.status_name === "Finished"
    ) {
      setTimeout(() => {
        return redirect(`/${streamer.username_id}`);
      }, 2000);
    }
  }, [matchData]);

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

      {/* TODO: Adicionar  Coluna lateral */}
      <div className="lg:col-span-4 space-y-6">
        {/* <PredictionsCard predictions={match.predictions} /> */}
        {/* <ChallengesCard challenges={match.challenges} /> */}
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
