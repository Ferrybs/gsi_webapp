import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap } from "lucide-react";

interface PredictionsCardProps {
  predictions: PredictionOption[];
}

export function PredictionsCard({ predictions }: PredictionsCardProps) {
  // Agrupar previsões por tipo
  const winnerPredictions = predictions.filter((p) => p.type === "winner");
  const scorePredictions = predictions.filter((p) => p.type === "score");
  const playerPredictions = predictions.filter((p) => p.type === "player");
  const eventPredictions = predictions.filter((p) => p.type === "event");

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Zap size={18} className="text-primary" />
          Previsões
        </CardTitle>
        <CardDescription>
          Faça suas previsões na partida em andamento
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="winner">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="winner">Vencedor</TabsTrigger>
            <TabsTrigger value="score">Placar</TabsTrigger>
            <TabsTrigger value="player">Jogador</TabsTrigger>
            <TabsTrigger value="event">Eventos</TabsTrigger>
          </TabsList>

          <TabsContent value="winner" className="space-y-4">
            <PredictionsList predictions={winnerPredictions} />
          </TabsContent>

          <TabsContent value="score" className="space-y-4">
            <PredictionsList predictions={scorePredictions} />
          </TabsContent>

          <TabsContent value="player" className="space-y-4">
            <PredictionsList predictions={playerPredictions} />
          </TabsContent>

          <TabsContent value="event" className="space-y-4">
            <PredictionsList predictions={eventPredictions} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function PredictionsList({ predictions }: { predictions: PredictionOption[] }) {
  return (
    <>
      {predictions.map((prediction) => (
        <div key={prediction.id} className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="font-medium">{prediction.title}</span>
            <Badge variant="outline" className="bg-primary/10">
              {prediction.odds.toFixed(2)}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Valor da previsão"
              min="10"
              step="10"
            />
            <Button size="sm">Prever</Button>
          </div>
        </div>
      ))}
    </>
  );
}
