"use server";
import { prisma } from "@/lib/prisma";
import { getServerSteamUser } from "@/lib/session";
import { Users, UsersSchema } from "@/schemas/users.schema";
import { ActionResponse } from "@/types/action-response";
import { getCurrentUser } from "./get-current-user";

export async function getCurrentUserAction(): Promise<ActionResponse<Users>> {
  const user = await getCurrentUser();
  if (!user) {
    return {
      success: false,
      error_message: "error.user_not_authenticated",
    };
  }
  return {
    success: true,
    data: UsersSchema.parse(user),
  };
}
