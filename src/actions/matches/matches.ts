"use server";

import { z } from "zod";
import type { StreamMatch } from "@/schemas/stream-matches.schema";
import type { MatchPlayerStats } from "@/schemas/match-player-stats.schema";
import { stream_match_status } from "@prisma/client";

const MatchFiltersSchema = z.object({
  status: z.nativeEnum(stream_match_status).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  streamerIds: z.array(z.string()).optional(),
  mapIds: z.array(z.string()).optional(),
  page: z.number().default(1),
  limit: z.number().default(10),
});

export type MatchFilters = z.infer<typeof MatchFiltersSchema>;

// Mock data for demonstration
const mockStreamers = [
  {
    id: "1",
    name: "gaules",
    avatar: "https://placehold.co/60x60?text=S",
  },
  {
    id: "2",
    name: "fallen",
    avatar: "https://placehold.co/60x60?text=S",
  },
  { id: "3", name: "coldzera", avatar: "https://placehold.co/60x60?text=S" },
];

const mockMaps = [
  { id: "1", name: "de_dust2" },
  { id: "2", name: "de_mirage" },
  { id: "3", name: "de_inferno" },
  { id: "4", name: "de_cache" },
];

const mockMatches: (StreamMatch & {
  streamer: { name: string; avatar: string };
  playerStats: MatchPlayerStats;
  map: { name: string };
})[] = [
  {
    id: "1",
    match_id: "match_1",
    streamer_id: "1",
    match_status: stream_match_status.Live,
    created_at: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    streamer: mockStreamers[0],
    map: mockMaps[0],
    playerStats: {
      id: "stats_1",
      match_id: "match_1",
      round: 15,
      ct_score: 8,
      t_score: 7,
      team_side_name: "CT" as any,
      kills: 12,
      deaths: 8,
      assists: 4,
      started_at: new Date(Date.now() - 12 * 60 * 1000),
      updated_at: new Date(),
    },
  },
  {
    id: "2",
    match_id: "match_2",
    streamer_id: "2",
    match_status: stream_match_status.Finished,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    streamer: mockStreamers[1],
    map: mockMaps[1],
    playerStats: {
      id: "stats_2",
      match_id: "match_2",
      round: 30,
      ct_score: 16,
      t_score: 14,
      team_side_name: "T" as any,
      kills: 24,
      deaths: 18,
      assists: 6,
      started_at: new Date(Date.now() - 2 * 60 * 60 * 1000),
      updated_at: new Date(),
    },
  },
];

export async function getStreamers() {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return mockStreamers;
}
