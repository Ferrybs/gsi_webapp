import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import type { NextRequest } from "next/server";

export const GET = (req: NextRequest, context: any) => {
  return NextAuth(req, context, authOptions(req));
};

export const POST = GET;
