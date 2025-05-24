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
import { getCurrentUserAction } from "./get-current-user-action";
import { ActionResponse } from "@/types/action-responde";
import { ActionError } from "@/types/action-error";

export type GetUserTransactionsActionResponse = {
  transactionsData: {
    transaction: UserTransaction;
    user_payments: UserPayment[];
    user_predictions: UserPrediction[];
  }[];
  pagination: Pagination;
};

export async function getUserTransactionsAction(
  paginationParams?: PaginationParams,
  transactionsTypes?: TransactionType[],
): Promise<ActionResponse<GetUserTransactionsActionResponse>> {
  try {
    const user = await getCurrentUserAction();

    // Validar e aplicar valores padrão aos parâmetros
    let page = 1;
    let limit = 20;
    if (paginationParams) {
      ({ page, limit } = PaginationParamsSchema.parse(paginationParams));
    }
    const skip = (page - 1) * limit;

    // Construir filtros
    const where = {
      user_id: user.id,
      AND: transactionsTypes?.map((type) => ({ type })),
    };

    // Buscar total de registros para paginação
    const total = await prisma.user_transactions.count({
      where,
    });

    // Buscar transações com paginação
    const transactions = await prisma.user_transactions.findMany({
      where,
      include: {
        user_payment_transactions: {
          include: {
            user_payments: true,
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
      user_payments: transaction.user_payment_transactions.map((pt) =>
        UserPaymentSchema.parse(pt.user_payments),
      ),
      user_predictions: transaction.user_prediction_transactions.map((pt) =>
        UserPredictionSchema.parse(pt.user_predictions),
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
