import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import type { Challenge } from "@/types/matches";

interface ChallengesCardProps {
  challenges: Challenge[];
}

export function ChallengesCard({ challenges }: ChallengesCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Trophy size={18} className="text-primary" />
          Desafios
        </CardTitle>
        <CardDescription>
          Participe de desafios para ganhar CS2Bits
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {challenges.map((challenge) => (
          <div key={challenge.id} className="border rounded-md p-3 space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="font-medium">{challenge.title}</span>
                <DifficultyBadge difficulty={challenge.difficulty} />
              </div>
              <Badge variant="secondary" className="bg-primary/10">
                {challenge.reward} CS2Bits
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {challenge.description}
            </p>
            <Button size="sm" className="w-full">
              Participar
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function DifficultyBadge({
  difficulty,
}: {
  difficulty: "easy" | "medium" | "hard";
}) {
  if (difficulty === "easy") {
    return (
      <Badge variant="outline" className="bg-green-500/10 text-green-500">
        Fácil
      </Badge>
    );
  }
  if (difficulty === "medium") {
    return (
      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
        Médio
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="bg-red-500/10 text-red-500">
      Difícil
    </Badge>
  );
}
