"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useSteamRedirect } from "@/hooks/use-steam-redirect";

export default function HomePage() {
  useSteamRedirect();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Bem-vindo ao GSI WebApp</h1>
      <Button
        onClick={() =>
          signIn("steam", {
            callbackUrl: "/auth/callback?redirect=http://localhost:4567/auth",
          })
        }
      >
        Login com Steam
      </Button>
    </main>
  );
}
