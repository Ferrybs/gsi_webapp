"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Ticket, Trophy } from "lucide-react";

import { getAllRafflesAction } from "@/actions/raffles/get-all-raffles-action";
import { RaffleCard } from "@/components/raffles/raffle-card";
import { ClosedRaffleItem } from "@/components/raffles/closed-raffle-item";
import {
  RaffleCardSkeleton,
  ClosedRaffleItemSkeleton,
} from "@/components/raffles/raffle-skeleton";
import { getUserBalanceAction } from "@/actions/user/get-user-balance-action";
import { CheckUserProfile } from "@/components/profile/check-user-profile";

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

  const { data: balanceResponse } = useQuery({
    queryKey: ["userBalance"],
    queryFn: getUserBalanceAction,
    refetchOnWindowFocus: false,
  });

  const handleToggleExpansion = (raffleId: string) => {
    // Only allow one card to be expanded at a time
    setExpandedRaffleId(expandedRaffleId === raffleId ? null : raffleId);
  };

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
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
        new Date(b.drawn_at!).getTime() - new Date(a.drawn_at!).getTime()
    );

  return (
    <>
      <CheckUserProfile />
      <div className="container mx-auto px-4 py-6 ">
        {/* Active Raffles */}
        <section className="mb-10 ml-10 justify-items-start">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
            {isLoading
              ? Array.from({ length: 1 }).map((_, index) => (
                  <RaffleCardSkeleton key={index} />
                ))
              : activeRaffles.length > 0
                ? activeRaffles.map((raffle) => (
                    <RaffleCard
                      key={raffle.id}
                      userBalance={balanceResponse?.data}
                      raffle={raffle}
                      isExpanded={expandedRaffleId === raffle.id}
                      onToggleExpansion={handleToggleExpansion}
                    />
                  ))
                : null}
          </div>
          {!isLoading && activeRaffles.length === 0 && (
            <div className="flex flex-col items-center justify-self-center py-16 px-6">
              <div className="bg-muted/30 rounded-full p-6 mb-4">
                <Ticket className="h-12 w-12 text-muted-foreground/60" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                {t("raffle.no_active_raffles_title")}
              </h3>
              <p className="text-muted-foreground text-center max-w-md">
                {t("raffle.no_active_raffles")}
              </p>
            </div>
          )}
        </section>

        {/* Recent Results */}
        <section>
          <h2 className="text-xl font-semibold mb-4">
            {t("raffle.recent_results")}
          </h2>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <ClosedRaffleItemSkeleton key={index} />
              ))}
            </div>
          ) : closedRaffles.length > 0 ? (
            <div className="space-y-3">
              {closedRaffles.map((raffle) => (
                <ClosedRaffleItem key={raffle.id} raffle={raffle} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <div className="bg-muted/30 rounded-full p-6 mb-4">
                <Trophy className="h-12 w-12 text-muted-foreground/60" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                {t("raffle.no_recent_results_title")}
              </h3>
              <p className="text-muted-foreground t ext-center max-w-md">
                {t("raffle.no_recent_results")}
              </p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
