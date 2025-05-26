"use server";

import { UserBalance, UserBalanceSchema } from "@/schemas/user-balance.schema";
import { ActionResponse } from "@/types/action-response";
import { getUserBalance } from "./get-user-balance";
import { ActionError } from "@/types/action-error";

export async function getUserBalanceAction(): Promise<
  ActionResponse<UserBalance>
> {
  try {
    const userBalance = await getUserBalance();

    if (!userBalance) {
      return { success: false, error_message: "error.user_not_authenticated" };
    }

    return { success: true, data: UserBalanceSchema.parse(userBalance) };
  } catch (error) {
    if (error instanceof ActionError) {
      return { success: false, error_message: error.message };
    }
    console.error("Error fetching user balance:", error);
    return { success: false, error_message: "error.fetching_user_balance" };
  }
}
