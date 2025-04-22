// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import type { NextRequest } from "next/server";
import { authOptions } from "@/lib/auth";

async function auth(
  req: NextRequest,
  ctx: {
    params: {
      nextauth: string[];
    };
  },
) {
  return NextAuth(req, ctx, authOptions(req));
}

export { auth as GET, auth as POST };
