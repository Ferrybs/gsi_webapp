"use server";
import { userCompleteSchema, Users } from "@/schemas/users.schema";
import { getCurrentUser } from "./get-current-user";

export async function getCurrentUserComplete(): Promise<Users | null> {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  const userComplete = userCompleteSchema.safeParse(user);

  if (!userComplete.success) {
    return null;
  }
  return user;
}
