import { useQuery } from "@tanstack/react-query";

export type LiveStreamer = {
  id: string;
  name: string;
  twitchUsername: string;
  avatarUrl: string;
  thumbnailUrl: string;
  viewers: number;
  isLive: boolean;
  odds: number;
};

export function useLiveStreamers() {
  return useQuery<LiveStreamer[]>({
    queryKey: ["live-streamers"],
    queryFn: async () => {
      const res = await fetch("/api/streamers/live");
      if (!res.ok) throw new Error("Failed to fetch live streamers");
      return res.json();
    },
    refetchInterval: 10000, // Atualiza a cada 10s
  });
}
