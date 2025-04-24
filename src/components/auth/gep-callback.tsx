"use client";
import { useSteamRedirect } from "@/hooks/use-steam-redirect";

export default function GEPCallback() {
  const { status } = useSteamRedirect();

  if (status === "loading") return null;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Redirecionando de volta para o GEP Client...</p>
    </div>
  );
}
