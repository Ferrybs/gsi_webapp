import { prisma } from "@/lib/prisma";
import { getCurrentUserAction } from "../user/get-current-user-action";
export async function updateUserBalanceByAggregateAction() {
  const user = await getCurrentUserAction();
  if (!user) throw new Error("User not found");

  const { _sum } = await prisma.user_transactions.aggregate({
    where: { user_id: user.id },
    _sum: { amount: true },
  });
  const total = _sum.amount ?? 0;

  return prisma.user_balances.upsert({
    where: { user_id: user.id },
    update: { balance: total },
    create: { user_id: user.id, balance: total },
  });
}
