// src/app/auth/callback/page.tsx
"use client";

import { useSteamRedirect } from "@/hooks/use-steam-redirect";

export default function AuthCallback() {
  const { status } = useSteamRedirect();

  if (status === "loading") return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Redirecionando de volta para o GSI Client...</p>
    </div>
  );
}
