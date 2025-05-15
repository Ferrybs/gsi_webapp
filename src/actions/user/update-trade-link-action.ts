"use server";
import { ActionResponse } from "@/types/action-responde";
import { getCurrentUserAction } from "./get-current-user-action";
import { validateTradeLinkAction } from "./validate-user-trade-link-action";
import { prisma } from "@/lib/prisma";
export async function updateTradeLinkAction(
  link: string,
): Promise<ActionResponse<boolean>> {
  const user = await getCurrentUserAction();
  if (!user) return { success: false, error_message: "error.user_not_found" };
  const res = await validateTradeLinkAction(link);
  if (!res.success) return res;

  await prisma.users.update({
    where: { id: user.id },
    data: { trade_link: link },
  });

  return { success: true, data: true };
}
