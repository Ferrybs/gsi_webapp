// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import type { NextRequest } from "next/server";
import { authOptions } from "@/lib/auth";

interface RouteHandlerContext {
  params: { nextauth: string[] };
}

async function auth(req: NextRequest, context: RouteHandlerContext) {
  return await NextAuth(req, context, authOptions(req));
}

export { auth as GET, auth as POST };
