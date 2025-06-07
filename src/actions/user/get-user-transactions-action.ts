"use server";

import { prisma } from "@/lib/prisma";
import { UserPayment, UserPaymentSchema } from "@/schemas/user-payment.schema";
import {
  TransactionType,
  UserTransaction,
  UserTransactionSchema,
} from "@/schemas/user-transaction.schema";
import {
  UserPrediction,
  UserPredictionSchema,
} from "@/schemas/prediction.schema";
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

export type GetUserTransactionsActionResponse = {
  transactionsData: {
    transaction: UserTransaction;
    user_payments_data: {
      user_payment: UserPayment;
      point_package: PointPackage;
    }[];
    user_predictions: UserPrediction[];
  }[];
  pagination: Pagination;
};

export async function getUserTransactionsAction(
  paginationParams?: PaginationParams,
  transactionsTypes?: TransactionType[]
): Promise<ActionResponse<GetUserTransactionsActionResponse>> {
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
      AND: transactionsTypes?.map((type) => ({ type })),
    };

    const total = await prisma.user_transactions.count({
      where,
    });

    const transactions = await prisma.user_transactions.findMany({
      where,
      include: {
        user_payment_transactions: {
          include: {
            user_payments: {
              include: {
                point_packages: true,
              },
            },
          },
        },
        user_prediction_transactions: {
          include: {
            user_predictions: {
              include: {
                predictions: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
      skip,
      take: limit,
    });

    const transactionsData = transactions.map((transaction) => ({
      transaction: UserTransactionSchema.parse(transaction),
      user_payments_data: transaction.user_payment_transactions.map((pt) => {
        return {
          user_payment: UserPaymentSchema.parse(pt.user_payments),
          point_package: PointPackageSchema.parse(
            pt.user_payments.point_packages
          ),
        };
      }),
      user_predictions: transaction.user_prediction_transactions.map((pt) =>
        UserPredictionSchema.parse(pt.user_predictions)
      ),
    }));

    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      success: true,
      data: {
        transactionsData,
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
