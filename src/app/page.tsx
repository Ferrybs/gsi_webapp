import SteamSignIn from "@/components/signIn/steam-signin";
import { Suspense } from "react";

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SteamSignIn />
    </Suspense>
  );
}
