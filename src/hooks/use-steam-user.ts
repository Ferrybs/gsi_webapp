// src/hooks/use-steam-user.ts
"use client";

import { SteamUser } from "@/models/steam-user";
import { useSession } from "next-auth/react";

export function useSteamUser() {
  const { data: session, status } = useSession();
  const user = session?.user as SteamUser;
  return { user, status };
}
