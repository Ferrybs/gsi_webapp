"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUserAction } from "../user/get-current-user-action";
import jwt from "jsonwebtoken";
import { Users } from "@/schemas/users.schema";

interface StreamerGSIAuth {
  id: string;
  name: string;
  avatar: string;
  roles: string[];
  token: string;
  valid_until: Number;
}

export async function getCurrentUserGSIAction(
  authToken?: string,
): Promise<StreamerGSIAuth | null> {
  var user: Users | null = null;
  if (!authToken) {
    user = await getCurrentUserAction();
  } else {
    const payload = jwt.verify(authToken, process.env.GSI_SECRET as string) as {
      id: string;
    };

    user = await prisma.users.findUnique({
      where: {
        steam_id: payload.id,
      },
      include: {
        user_roles: true,
      },
    });
  }

  if (!user) {
    return null;
  }

  const streamer = await prisma.streamers.findUnique({
    where: {
      id: user.id,
    },
  });

  if (!streamer) {
    return null;
  }

  const token = jwt.sign(
    {
      user_id: user.steam_id,
    },
    process.env.GRPC_SECRET as string,
    { expiresIn: "2d" },
  );

  return {
    id: user.steam_id,
    name: streamer.username_id,
    avatar: user.avatar_url ?? "https://placehold.co/80x80?text=U",
    roles: user.user_roles.map((role) => role.role_name),
    valid_until: Math.floor(Date.now() / 1000) + 2 * 18 * 60 * 60, // 1.5 day in seconds
    token,
  };
}
