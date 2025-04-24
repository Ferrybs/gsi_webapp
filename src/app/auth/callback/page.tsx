// src/app/auth/callback/page.tsx
import GEPCallback from "@/components/auth/gep-callback";
import { Suspense } from "react";

export default function AuthCallback() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GEPCallback />
    </Suspense>
  );
}
