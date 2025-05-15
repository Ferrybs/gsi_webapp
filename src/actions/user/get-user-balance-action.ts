"use server";

import { UserBalanceSchema } from "@/schemas/user-balance.schema";
import { getCurrentUserAction } from "./get-current-user-action";
import { prisma } from "@/lib/prisma";

export async function getUserBalanceAction() {
  const user = await getCurrentUserAction();

  if (!user?.id) {
    return null;
  }

  try {
    const userBalance = await prisma.user_balances.findUnique({
      where: {
        user_id: user.id,
      },
    });

    if (!userBalance) {
      const newUserBalance = await prisma.user_balances.create({
        data: {
          user_id: user.id,
          balance: 0,
          event_balance: 0,
        },
      });

      return UserBalanceSchema.parse(newUserBalance);
    }

    if (!userBalance) {
      return null;
    }

    return UserBalanceSchema.parse(userBalance);
  } catch (error) {
    console.error("Error fetching user balance:", error);
    return null;
  }
}
