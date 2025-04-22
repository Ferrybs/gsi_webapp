import { SteamUser } from "@/models/steam-user";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { NextRequest } from "next/server";
import { NextApiRequest } from "next";

export async function getSteamUser(
  req: Request | NextRequest | NextApiRequest,
) {
  const session = await getServerSession(authOptions(req));
  if (!session) return null;
  const user = session?.user as SteamUser;
  return user;
}
