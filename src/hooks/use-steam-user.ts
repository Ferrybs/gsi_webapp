// src/hooks/use-steam-user.ts
"use client";

import { useSession } from "next-auth/react";

export type SteamUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  id?: string | null;
  token?: string;
};

export function useSteamUser() {
  const { data: session, status } = useSession();
  const user = session?.user as SteamUser;
  return { user, status };
}
