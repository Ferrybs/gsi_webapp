// src/app/auth/callback/page.tsx
import GEPCallback from "@/components/auth/gep-callback";
import { useSteamRedirect } from "@/hooks/use-steam-redirect";
import { Suspense } from "react";

export default function AuthCallback() {
  const { status } = useSteamRedirect();

  if (status === "loading") return <div>Loading...</div>;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GEPCallback />
    </Suspense>
  );
}
