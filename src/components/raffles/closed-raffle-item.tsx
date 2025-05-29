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

  // Determine the exterior color class based on the skin's exterior
  const getExteriorColorClass = () => {
    switch (raffle.skin.exterior) {
      case "FactoryNew":
        return "from-blue-500/10 to-blue-600/20";
      case "MinimalWear":
        return "from-purple-500/10 to-purple-600/20";
      case "FieldTested":
        return "from-green-500/10 to-green-600/20";
      case "WellWorn":
        return "from-yellow-500/10 to-yellow-600/20";
      case "BattleScarred":
        return "from-red-500/10 to-red-600/20";
      default:
        return "from-gray-500/10 to-gray-600/20";
    }
  };

  return (
    <Card className="transition-all hover:shadow-sm">
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          <div className="relative w-14 h-14 flex-shrink-0 rounded overflow-hidden">
            <div
              className={`absolute inset-0 bg-gradient-to-br ${getExteriorColorClass()} z-0`}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <Image
                src={
                  raffle.skin.image_url || "/placeholder.svg?height=64&width=64"
                }
                alt={raffle.skin.market_hash_name}
                width={48}
                height={48}
                className="object-contain drop-shadow-sm"
                crossOrigin="anonymous"
              />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm truncate">
              {raffle.skin.market_hash_name}
            </h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Trophy className="h-3 w-3 text-yellow-500" />
              <span className="text-xs text-muted-foreground truncate">
                {t("raffle.winner")}: {raffle.winner_username}
              </span>
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {t("raffle.drawn_on")}: {formatDate(raffle.drawn_at!)}
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <Badge variant="outline" className="text-xs">
              {t("raffle.closed")}
            </Badge>
            <Button variant="ghost" size="sm" className="h-7 text-xs">
              <Eye className="h-3 w-3 mr-1" />
              {t("raffle.view_result")}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
