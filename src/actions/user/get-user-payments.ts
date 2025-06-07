"use server";

import { prisma } from "@/lib/prisma";
import { UserPayment, UserPaymentSchema } from "@/schemas/user-payment.schema";
import {
  Pagination,
  PaginationParams,
  PaginationParamsSchema,
  PaginationSchema,
} from "@/schemas/pagination.schema";
import { ActionResponse } from "@/types/action-response";
import { ActionError } from "@/types/action-error";
import { getCurrentUser } from "./get-current-user";
import {
  PointPackage,
  PointPackageSchema,
} from "@/schemas/point-package.schema";

export type GetUserPaymentsActionResponse = {
  paymentsData: {
    user_payment: UserPayment;
    point_packages: PointPackage;
  }[];
  pagination: Pagination;
};

export async function getUserPaymentsAction(
  paginationParams?: PaginationParams
): Promise<ActionResponse<GetUserPaymentsActionResponse>> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return { success: false, error_message: "error.user_not_found" };
    }

    let page = 1;
    let limit = 20;
    if (paginationParams) {
      ({ page, limit } = PaginationParamsSchema.parse(paginationParams));
    }
    const skip = (page - 1) * limit;

    const where = {
      user_id: user.id,
    };

    const total = await prisma.user_payments.count({
      where,
    });

    const payments = await prisma.user_payments.findMany({
      where,
      include: {
        point_packages: true,
      },
      orderBy: {
        created_at: "desc",
      },
      skip,
      take: limit,
    });

    const paymentsData = payments.map((payments) => ({
      user_payment: UserPaymentSchema.parse(payments),
      point_packages: PointPackageSchema.parse(payments.point_packages),
    }));

    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      success: true,
      data: {
        paymentsData,
        pagination: PaginationSchema.parse({
          page,
          limit,
          total,
          totalPages,
          hasNext,
          hasPrev,
        }),
      },
    };
  } catch (error) {
    console.error("Error fetching user transactions:", error);
    if (error instanceof ActionError) {
      return { success: false, error_message: error.message };
    }
    return {
      success: false,
      error_message: "error.generic",
    };
  }
}
