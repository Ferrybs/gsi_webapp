import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getCurrentUserAction } from "../user/get-current-user-action";
import { payment_provider } from "@prisma/client";

const CreatePaymentSchema = z.object({
  packageId: z.number(),
  provider: z.nativeEnum(payment_provider),
});

export type CreateDefaultPayment = z.infer<typeof CreatePaymentSchema>;

export async function createDefaultPayment(data: CreateDefaultPayment) {
  const user = await getCurrentUserAction();

  if (!user?.id) {
    throw new Error("User not authenticated");
  }

  const validatedData = CreatePaymentSchema.parse(data);

  // Get the package
  const pointPackage = await prisma.point_packages.findUnique({
    where: {
      id: validatedData.packageId,
      active: true,
    },
  });

  if (!pointPackage) {
    throw new Error("Package not found or inactive");
  }

  let totalPoints = pointPackage.points_amount.plus(pointPackage.bonus_points);

  const payment = await prisma.user_payments.create({
    data: {
      user_id: user.id,
      provider: validatedData.provider,
      fiat_amount: pointPackage.price,
      currency_name: pointPackage.currency,
      points_amount: totalPoints,
      status: "Pending",
    },
  });

  return { user, payment, pointPackage };
}
