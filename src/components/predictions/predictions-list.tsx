"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { Flame } from "lucide-react";
import { Prediction } from "@/schemas/prediction.schema";
import { PredictionCard } from "./prediction-card";
import { Streamer } from "@/schemas/streamer.schema";

interface PredictionsListProps {
  streamer: Streamer;
  predictions: Prediction[];
  currentRound: number;
}

export function PredictionsList({
  streamer,
  predictions,
  currentRound,
}: PredictionsListProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      {predictions.length === 0 ? (
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
            streamer={streamer}
            prediction={prediction}
            currentRound={currentRound}
          />
        ))
      )}
    </div>
  );
}
