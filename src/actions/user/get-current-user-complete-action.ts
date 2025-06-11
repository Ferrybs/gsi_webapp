"use server";
import { Users, UsersSchema } from "@/schemas/users.schema";
import { ActionResponse } from "@/types/action-response";
import { getCurrentUserComplete } from "./get-current-user-complete";

export async function getCurrentUserCompleteAction(): Promise<
  ActionResponse<Users>
> {
  const user = await getCurrentUserComplete();
  if (!user) {
    return {
      success: false,
      error_message: "error.user_not_complete",
    };
  }

  return {
    success: true,
    data: UsersSchema.parse(user),
  };
}
