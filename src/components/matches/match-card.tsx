import Link from "next/link";
import { Clock, Eye } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MatchPredictionsTabs } from "./match-predictions-tabs";
import { formatTimeSince } from "@/lib/utils";
import type { Match } from "@/types/matches";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";

interface MatchCardProps {
  match: Match;
}

export function MatchCard({ match }: MatchCardProps) {
  return (
    <Card className="overflow-hidden h-full flex flex-col px-2">
      <CardHeader className="flex-row space-y-0 px-4">
        <MatchScoreCard match={match} />
      </CardHeader>

      <CardContent className="px-4">
        <MatchPredictionsTabs match={match} />
      </CardContent>
      <CardFooter className="px-4">
        <Link href={`/matches/${match.id}`} className="block w-full">
          <Button size="sm" className="w-full text-xs">
            Participar
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

function MatchScoreCard({ match }: { match: Match }) {
  return (
    <div className="relative rounded-md overflow-hidden  bg-card/50 px-2 mt-0">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4 h-20 w-20">
            <Avatar>
              <AvatarImage src={match.streamerId} />
              <AvatarFallback>
                {match.streamerName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{match.streamerName}</div>
            </div>
          </div>
          <div className="text-xl font-mono font-bold">
            {match.score.teamA} - {match.score.teamB}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <Badge variant="outline" className="flex items-center gap-1">
            <Eye size={12} />
            {new Intl.NumberFormat("pt-BR").format(match.viewerCount)}
          </Badge>
          <Badge variant="destructive" className="font-bold">
            AO VIVO
          </Badge>
        </div>
      </div>
    </div>
  );
}
