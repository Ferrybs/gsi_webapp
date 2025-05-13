"use client";

import { useState } from "react";
import MatchesList from "@/components/matches/matches-list";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useMatches } from "@/hooks/use-matches";

export default function MatchesPage() {
  const [selectedStreamers, setSelectedStreamers] = useState<string[]>([]);
  const [selectedMaps, setSelectedMaps] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Buscar partidas com filtros e paginação
  const {
    data: matchesData,
    isLoading: isLoadingMatches,
    error: matchesError,
  } = useMatches({
    page: currentPage,
    streamers: selectedStreamers,
    maps: selectedMaps,
  });

  // Resetar para a primeira página quando os filtros mudam
  const handleStreamerChange = (streamers: string[]) => {
    setSelectedStreamers(streamers);
    setCurrentPage(1);
  };

  const handleMapChange = (maps: string[]) => {
    setSelectedMaps(maps);
    setCurrentPage(1);
  };

  // Verificar erros
  if (matchesError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro</AlertTitle>
        <AlertDescription>
          Ocorreu um erro ao carregar os dados. Por favor, tente novamente mais
          tarde.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      {/* <MatchesFilter
        streamers={streamers || []}
        selectedStreamers={selectedStreamers}
        selectedMaps={selectedMaps}
        setSelectedStreamers={handleStreamerChange}
        setSelectedMaps={handleMapChange}
        isLoading={isLoadingStreamers}
      /> */}

      <MatchesList
        matches={matchesData?.matches || []}
        currentPage={currentPage}
        totalPages={matchesData?.pagination.totalPages || 1}
        setCurrentPage={setCurrentPage}
        isLoading={isLoadingMatches}
      />
    </>
  );
}
