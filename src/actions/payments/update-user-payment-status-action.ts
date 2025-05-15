"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUserAction } from "../user/get-current-user-action";

export async function updateUserPaymentStatusAction(
  paymentId: string,
  status: "Failed" | "Canceled",
) {
  try {
    const user = await getCurrentUserAction();

    if (!user) {
      throw new Error("User not found");
    }

    await prisma.user_payments.update({
      where: {
        id: paymentId,
        user_id: user.id,
      },
      data: {
        status: status,
        updated_at: new Date(),
      },
    });

    return { success: true };
  } catch (error) {
    console.error(`Error updating payment status to ${status}:`, error);
    return {
      success: false,
      error: `Failed to update payment status to ${status}`,
    };
  }
}
