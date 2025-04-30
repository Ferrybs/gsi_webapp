import { useQuery } from "@tanstack/react-query";

export type Challenge = {
  id: string;
  title: string;
  reward: string;
  expiresIn: string;
  status: "active" | "expired";
};

export function useRecentChallenges() {
  return useQuery<Challenge[]>({
    queryKey: ["recent-challenges"],
    queryFn: async () => {
      const res = await fetch("/api/challenges/recent");
      if (!res.ok) throw new Error("Failed to fetch recent challenges");
      return res.json();
    },
    refetchInterval: 30000,
  });
}
