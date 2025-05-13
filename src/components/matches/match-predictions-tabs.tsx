import Link from "next/link";
import { Trophy, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Match } from "@/types/matches";

interface MatchPredictionsTabsProps {
  match: Match;
}

export function MatchPredictionsTabs({ match }: MatchPredictionsTabsProps) {
  return (
    <Tabs defaultValue="bets" className="mt-3">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="bets" className="flex items-center gap-1">
          <Zap size={14} />
          Previsões
        </TabsTrigger>
        <TabsTrigger value="challenges" className="flex items-center gap-1">
          <Trophy size={14} />
          Desafios
        </TabsTrigger>
      </TabsList>
      <TabsContent value="bets" className="mt-2 space-y-2">
        <div className="grid grid-cols-3 gap-2">
          {match.predictions.slice(0, 3).map((prediction) => (
            <Button
              key={prediction.id}
              variant="outline"
              size="sm"
              className="flex items-center justify-between text-xs h-auto py-1.5"
            >
              <span>{prediction.title}</span>
              <Badge
                variant="secondary"
                className="ml-1 bg-primary/10 hover:bg-primary/20"
              >
                {prediction.odds.toFixed(2)}
              </Badge>
            </Button>
          ))}
        </div>
      </TabsContent>
      <TabsContent value="challenges" className="mt-2 space-y-2">
        <div className="space-y-2">
          {match.challenges.slice(0, 2).map((challenge) => (
            <div
              key={challenge.id}
              className="flex items-center justify-between rounded-md border p-2 text-xs"
            >
              <div className="flex flex-col">
                <span className="font-medium">{challenge.title}</span>
                <span className="text-muted-foreground text-[10px]">
                  {challenge.description}
                </span>
              </div>
              <Badge
                variant="outline"
                className="bg-primary/10 hover:bg-primary/20"
              >
                {challenge.reward} CS2Bits
              </Badge>
            </div>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
