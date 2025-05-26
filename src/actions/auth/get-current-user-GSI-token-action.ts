"use server";
import { ActionResponse } from "@/types/action-response";
import jwt from "jsonwebtoken";
import { getCurrentUser } from "../user/get-current-user";
export async function getCurrentUserGSITokenAction(): Promise<
  ActionResponse<string>
> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      success: false,
      error_message: "error.user_not_authenticated",
    };
  }
  const token = jwt.sign(
    {
      id: user.steam_id,
    },
    process.env.GSI_SECRET as string,
    { expiresIn: "2d" },
  );
  return { success: true, data: token };
}
