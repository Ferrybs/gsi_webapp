"use client";

import { Users } from "lucide-react";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import type { Match } from "@/types/matches";
import { MatchCard } from "./match-card";

interface MatchesListProps {
  matches: Match[];
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  isLoading: boolean;
}

export default function MatchesList({
  matches,
  currentPage,
  totalPages,
  setCurrentPage,
  isLoading,
}: MatchesListProps) {
  if (isLoading) {
    return <MatchesListSkeleton />;
  }

  if (matches.length === 0) {
    return <EmptyMatchesList />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {matches.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

function EmptyMatchesList() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-3 mb-4">
        <Users size={24} className="text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium">Nenhuma partida encontrada</h3>
      <p className="text-muted-foreground mt-1 max-w-md">
        Não encontramos partidas com os filtros selecionados. Tente ajustar seus
        filtros ou volte mais tarde.
      </p>
    </div>
  );
}

function MatchesListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array(6)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-16" />
            </div>
            <Skeleton className="h-40 w-full" />
            <div className="flex justify-between">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        ))}
    </div>
  );
}
