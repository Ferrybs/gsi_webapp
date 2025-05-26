"use server";

import { UserBalance, UserBalanceSchema } from "@/schemas/user-balance.schema";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "./get-current-user";

export async function getUserBalance(): Promise<UserBalance | null> {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }
  let userBalance = await prisma.user_balances.findUnique({
    where: {
      user_id: user.id,
    },
  });

  if (!userBalance) {
    userBalance = await prisma.user_balances.create({
      data: {
        user_id: user.id,
        balance: 0,
        event_balance: 0,
      },
    });
  }
  return UserBalanceSchema.parse(userBalance);
}
