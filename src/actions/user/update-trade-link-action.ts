"use server";
import { ActionResponse } from "@/types/action-response";
import { validateTradeLinkAction } from "./validate-user-trade-link-action";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "./get-current-user";
export async function updateTradeLinkAction(
  link: string
): Promise<ActionResponse<boolean>> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error_message: "error.user_not_found" };
  const res = await validateTradeLinkAction(link.trim());
  if (!res.success) return res;

  await prisma.users.update({
    where: { id: user.id },
    data: { trade_link: link.trim() },
  });

  return { success: true, data: true };
}
