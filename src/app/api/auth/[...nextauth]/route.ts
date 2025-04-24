import NextAuth from "next-auth";
import type { NextRequest } from "next/server";
import { authOptions } from "@/lib/auth";

export const GET = (
  req: NextRequest,
  context: { params: { nextauth: string[] } },
) => {
  return NextAuth(req, context, authOptions(req));
};

export const POST = (
  req: NextRequest,
  context: { params: { nextauth: string[] } },
) => {
  return NextAuth(req, context, authOptions(req));
};
