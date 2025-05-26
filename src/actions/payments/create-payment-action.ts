"use server";

import { payment_provider, payment_status } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ActionResponse } from "@/types/action-response";
import {
  CreatePayment,
  CreatePaymentResponse,
  CreatePaymentSchema,
} from "@/schemas/handle-payment.schema";
import { createCoinbasePayment } from "./create-coinbase-payment";
import { createStripePayment } from "./create-stripe-payment";
import { getCurrentUserAction } from "../user/get-current-user-action";

export default async function createPaymentAction(
  data: CreatePayment,
): Promise<ActionResponse<CreatePaymentResponse>> {
  try {
    const user = await getCurrentUserAction();

    if (!user) {
      return {
        success: false,
        error_message: "error.user_not_authenticated",
      };
    }
    const dataParsed = CreatePaymentSchema.parse(data);
    const point_package = await prisma.point_packages.findUnique({
      where: {
        id: dataParsed.packageId,
        active: true,
      },
    });

    if (!point_package) {
      return {
        success: false,
        error_message: "error.point_package_not_found",
      };
    }

    if (point_package.limit_per_user && point_package.limit_per_user > 0) {
      const userPaymentCount = await prisma.user_payments.count({
        where: {
          user_id: user.id,
          package_id: point_package.id,
          AND: [
            {
              status: {
                not: payment_status.Canceled,
              },
            },
            {
              status: {
                not: payment_status.Failed,
              },
            },
          ],
        },
      });
      if (userPaymentCount >= point_package.limit_per_user) {
        return {
          success: false,
          error_message: "error.point_package_limit_reached",
        };
      }
    }

    let result: CreatePaymentResponse | null = null;
    if (
      point_package.currency === "USDC" ||
      dataParsed.provider === payment_provider.Coinbase
    ) {
      result = await createCoinbasePayment(user, dataParsed);
    } else {
      result = await createStripePayment(user, dataParsed);
    }
    if (!result) {
      return {
        success: false,
        error_message: "error.payment_creation_failed",
      };
    }
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Error creating payment:", error);
    return {
      success: false,
      error_message: "error.payment_creation_failed",
    };
  }
}
