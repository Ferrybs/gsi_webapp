"use client";

import { useState } from "react";
import { Check, ChevronDown, Filter, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { Streamer } from "@/types/matches";

interface MatchesFilterProps {
  streamers: Streamer[];
  selectedStreamers: string[];
  selectedMaps: string[];
  setSelectedStreamers: (streamers: string[]) => void;
  setSelectedMaps: (maps: string[]) => void;
  isLoading: boolean;
}

export default function MatchesFilter({
  streamers,
  selectedStreamers,
  selectedMaps,
  setSelectedStreamers,
  setSelectedMaps,
  isLoading,
}: MatchesFilterProps) {
  const [isStreamerOpen, setIsStreamerOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);

  // Lista de mapas disponíveis no CS2
  const availableMaps = [
    "Dust2",
    "Mirage",
    "Inferno",
    "Nuke",
    "Overpass",
    "Vertigo",
    "Ancient",
    "Anubis",
  ];

  // Adicionar um estado para a busca de streamers
  const [streamerSearch, setStreamerSearch] = useState("");

  // Adicionar uma função para filtrar streamers com base na busca
  const filteredStreamers = streamers.filter((streamer) =>
    streamer.name.toLowerCase().includes(streamerSearch.toLowerCase()),
  );

  // Toggle para seleção de streamers
  const toggleStreamer = (streamerId: string) => {
    setSelectedStreamers(
      selectedStreamers.includes(streamerId)
        ? selectedStreamers.filter((id) => id !== streamerId)
        : [...selectedStreamers, streamerId],
    );
  };

  // Toggle para seleção de mapas
  const toggleMap = (map: string) => {
    setSelectedMaps(
      selectedMaps.includes(map)
        ? selectedMaps.filter((m) => m !== map)
        : [...selectedMaps, map],
    );
  };

  // Limpar todos os filtros
  const clearFilters = () => {
    setSelectedStreamers([]);
    setSelectedMaps([]);
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2 ">
        {/* Dropdown de Streamers */}
        <DropdownMenu open={isStreamerOpen} onOpenChange={setIsStreamerOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2" disabled={isLoading}>
              <Users size={16} />
              Streamers
              {isLoading ? (
                <Skeleton className="h-4 w-4 rounded-full" />
              ) : (
                <ChevronDown size={16} />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-70">
            <DropdownMenuLabel>Streamers</DropdownMenuLabel>
            <div className="px-2 py-2">
              <Input
                placeholder="Buscar streamer..."
                value={streamerSearch}
                onChange={(e) => setStreamerSearch(e.target.value)}
                className="h-8"
              />
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuGroup className="max-h-60 overflow-y-auto">
              {isLoading ? (
                Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <DropdownMenuItem key={i} disabled>
                      <div className="flex items-center gap-2 flex-1">
                        <Skeleton className="h-6 w-6 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </DropdownMenuItem>
                  ))
              ) : filteredStreamers.length > 0 ? (
                filteredStreamers.map((streamer) => (
                  <DropdownMenuItem
                    key={streamer.id}
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => toggleStreamer(streamer.id)}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={streamer.avatarUrl || "/placeholder.svg"}
                          alt={streamer.name}
                        />
                        <AvatarFallback>
                          {streamer.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{streamer.name}</span>
                      {streamer.isLive && (
                        <Badge
                          variant="destructive"
                          className="ml-auto text-xs px-1"
                        >
                          LIVE
                        </Badge>
                      )}
                    </div>
                    {selectedStreamers.includes(streamer.id) && (
                      <Check size={16} />
                    )}
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="px-2 py-2 text-sm text-muted-foreground text-center">
                  Nenhum streamer encontrado
                </div>
              )}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Dropdown de Mapas */}
        <DropdownMenu open={isMapOpen} onOpenChange={setIsMapOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <MapPin size={16} />
              Mapas
              <ChevronDown size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Mapas</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {availableMaps.map((map) => (
                <DropdownMenuItem
                  key={map}
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => toggleMap(map)}
                >
                  <span className="flex-1">{map}</span>
                  {selectedMaps.includes(map) && <Check size={16} />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Badges para filtros ativos */}
        {selectedStreamers.length > 0 && (
          <Badge variant="secondary" className="gap-1">
            Streamers: {selectedStreamers.length}
            <button
              onClick={() => setSelectedStreamers([])}
              className="ml-1 hover:bg-muted rounded-full p-0.5"
            >
              ×
            </button>
          </Badge>
        )}

        {selectedMaps.length > 0 && (
          <Badge variant="secondary" className="gap-1">
            Mapas: {selectedMaps.length}
            <button
              onClick={() => setSelectedMaps([])}
              className="ml-1 hover:bg-muted rounded-full p-0.5"
            >
              ×
            </button>
          </Badge>
        )}
      </div>

      {/* Botão para limpar filtros */}
      {(selectedStreamers.length > 0 || selectedMaps.length > 0) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="self-start"
        >
          <Filter size={16} className="mr-2" />
          Limpar filtros
        </Button>
      )}
    </div>
  );
}
