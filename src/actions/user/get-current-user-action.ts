"use server";
import { prisma } from "@/lib/prisma";
import { getServerSteamUser } from "@/lib/session";

export async function getCurrentUserAction() {
  const steamUser = await getServerSteamUser();

  if (!steamUser) {
    return null;
  }

  const user = await prisma.users.findUnique({
    where: {
      steam_id: steamUser.id,
    },
    include: {
      user_roles: true,
    },
  });

  return user;
}
