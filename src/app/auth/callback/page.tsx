// src/app/auth/callback/page.tsx
"use client";

import { useSteamRedirect } from "@/hooks/use-steam-redirect";
import { Suspense } from "react";

export default function AuthCallback() {
  const { status } = useSteamRedirect();

  if (status === "loading") return null;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen flex items-center justify-center">
        <p>Redirecionando de volta para o GSI Client...</p>
      </div>
    </Suspense>
  );
}
