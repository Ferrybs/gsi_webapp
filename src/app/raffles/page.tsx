"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { getAllRafflesAction } from "@/actions/raffles/get-all-raffles-action";
import { RaffleCard } from "@/components/raffles/raffle-card";
import { ClosedRaffleItem } from "@/components/raffles/closed-raffle-item";
import {
  RaffleCardSkeleton,
  ClosedRaffleItemSkeleton,
} from "@/components/raffles/raffle-skeleton";

export default function RafflesPage() {
  const { t } = useTranslation();
  const [expandedRaffleId, setExpandedRaffleId] = useState<string | null>(null);

  const {
    data: response,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["raffles"],
    queryFn: getAllRafflesAction,
  });

  const handleToggleExpansion = (raffleId: string) => {
    setExpandedRaffleId(expandedRaffleId === raffleId ? null : raffleId);
  };

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-[1200px]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t("raffle.error_title")}</h1>
          <p className="text-muted-foreground">{t("raffle.error_message")}</p>
        </div>
      </div>
    );
  }

  const raffles = response?.data || [];
  const activeRaffles = raffles
    .filter((raffle) => raffle.status === "active")
    .slice(0, 3);
  const closedRaffles = raffles
    .filter((raffle) => raffle.status === "closed")
    .sort(
      (a, b) =>
        new Date(b.drawn_at!).getTime() - new Date(a.drawn_at!).getTime(),
    );

  return (
    <div className="container mx-auto px-4 py-8 max-w-[1200px]">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t("raffle.title")}</h1>
        <p className="text-muted-foreground">{t("raffle.subtitle")}</p>
      </div>

      {/* Active Raffles */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">
          {t("raffle.active_raffles")}
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <RaffleCardSkeleton key={index} />
            ))}
          </div>
        ) : activeRaffles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeRaffles.map((raffle) => (
              <RaffleCard
                key={raffle.id}
                raffle={raffle}
                isExpanded={expandedRaffleId === raffle.id}
                onToggleExpansion={handleToggleExpansion}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {t("raffle.no_active_raffles")}
            </p>
          </div>
        )}
      </section>

      {/* Recent Results */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">
          {t("raffle.recent_results")}
        </h2>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <ClosedRaffleItemSkeleton key={index} />
            ))}
          </div>
        ) : closedRaffles.length > 0 ? (
          <div className="space-y-4">
            {closedRaffles.map((raffle) => (
              <ClosedRaffleItem key={raffle.id} raffle={raffle} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {t("raffle.no_recent_results")}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
