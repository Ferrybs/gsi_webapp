"use client";

import { useTranslation } from "react-i18next";
import { Trophy, Eye } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { RaffleWithSkin } from "@/actions/raffles/get-all-raffles-action";

interface ClosedRaffleItemProps {
  raffle: RaffleWithSkin;
}

export function ClosedRaffleItem({ raffle }: ClosedRaffleItemProps) {
  const { t } = useTranslation();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 flex-shrink-0">
            <Image
              src={
                raffle.skin.image_url || "/placeholder.svg?height=64&width=64"
              }
              alt={raffle.skin.market_hash_name}
              fill
              className="object-cover rounded"
              crossOrigin="anonymous"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm truncate">
              {raffle.skin.market_hash_name}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <Trophy className="h-3 w-3 text-yellow-500" />
              <span className="text-sm text-muted-foreground">
                {t("raffle.winner")}: {raffle.winner_username}
              </span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {t("raffle.drawn_on")}: {formatDate(raffle.drawn_at!)}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Badge variant="outline" className="text-xs">
              {t("raffle.closed")}
            </Badge>
            <Button variant="ghost" size="sm">
              <Eye className="h-3 w-3 mr-1" />
              {t("raffle.view_result")}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
