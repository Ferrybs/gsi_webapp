// src/hooks/use-steam-redirect.ts
"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSteamUser } from "./use-steam-user";
import { signIn } from "next-auth/react";

export function useSteamRedirect() {
  const { user, status } = useSteamUser();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  useEffect(() => {
    if (status === "unauthenticated" && redirect) {
      signIn("steam", {
        callbackUrl: `/auth/callback?redirect=${redirect}`,
      });
    }
    if (status === "authenticated" && redirect && user?.token) {
      const url = `${redirect}?token=${encodeURIComponent(user.token)}`;
      window.location.href = url;
    }
  }, [status, user, redirect]);

  return { status };
}
