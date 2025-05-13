import { SteamUser } from "@/types/steam-user";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export async function getServerSteamUser(): Promise<SteamUser | null> {
  const session = await getServerSession(authOptions(null));
  if (!session) return null;
  const user = session?.user as SteamUser;
  return user;
}
