"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useSteamUser } from "@/hooks/use-steam-user";

export function useSteamRedirect() {
  const { user, status } = useSteamUser();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  useEffect(() => {
    const handleRedirect = async () => {
      if (status === "authenticated" && redirect && user?.id) {
        try {
          const res = await fetch("/api/issue-token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ redirect }),
          });

          const data = await res.json();

          if (res.ok && data.token) {
            const url = `${redirect}?token=${encodeURIComponent(data.token)}`;
            window.location.href = url;
          } else {
            console.error("Erro ao gerar token:", data.error);
          }
        } catch (err) {
          console.error("Erro de rede ao gerar token:", err);
        }
      }
    };

    if (status === "unauthenticated" && redirect) {
      signIn("steam", {
        callbackUrl: `/auth/callback?redirect=${redirect}`,
      });
    }

    if (status === "authenticated" && redirect) {
      handleRedirect();
    }
  }, [status, user, redirect]);

  return { status };
}
