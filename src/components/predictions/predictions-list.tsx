"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";
import { Flame } from "lucide-react";
import { getPredictionsAction } from "@/actions/predictions/get-predictions-action";
import {
  EnhancedPredictionOptionSchema,
  type EnhancedPrediction,
} from "@/schemas/prediction.schema";
import { PredictionCard } from "./prediction-card";

interface PredictionsListProps {
  matchId: string;
  currentRound: number;
}

export function PredictionsList({
  matchId,
  currentRound,
}: PredictionsListProps) {
  const { t } = useTranslation();
  const [predictions, setPredictions] = useState<EnhancedPrediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPredictions = async () => {
    try {
      setIsLoading(true);
      const res = await getPredictionsAction(matchId);
      setPredictions(res);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchPredictions();
  }, [matchId]);

  // Refetch every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchPredictions();
    }, 10000);

    return () => clearInterval(interval);
  }, [matchId]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold flex items-center gap-2">
        <Flame size={18} className="text-primary" />
        {t("predictions.title")}
      </h3>

      {isLoading ? (
        <PredictionsLoading />
      ) : error ? (
        <Card>
          <CardHeader>
            <CardTitle>{t("predictions.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {t("predictions.error_loading")}
            </p>
          </CardContent>
        </Card>
      ) : !predictions || predictions.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame size={18} className="text-primary" />
              {t("predictions.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {t("predictions.no_predictions")}
            </p>
          </CardContent>
        </Card>
      ) : (
        predictions.map((prediction) => (
          <PredictionCard
            key={prediction.id}
            prediction={prediction}
            currentRound={currentRound}
          />
        ))
      )}
    </div>
  );
}

function PredictionsLoading() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2 mt-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}
