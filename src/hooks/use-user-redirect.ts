"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { getCurrentUserGSITokenAction } from "@/actions/auth/get-current-user-GSI-token-action";

export function useSteamRedirect() {
  const { data: user, status } = useSession();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  useEffect(() => {
    const handleRedirect = async () => {
      if (status === "authenticated" && redirect && user) {
        try {
          const response = await getCurrentUserGSITokenAction();

          if (response.success && response.data) {
            const url = `${redirect}?token=${encodeURIComponent(response.data)}`;
            window.location.href = url;
          } else {
            console.error("Error fetching GSI token");
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
