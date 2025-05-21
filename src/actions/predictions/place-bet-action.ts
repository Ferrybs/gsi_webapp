"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUserAction } from "../user/get-current-user-action";
import { getUserBalanceAction } from "../user/get-user-balance-action";
import {
  type PlaceBetResponse,
  PlaceBetResponseSchema,
} from "@/schemas/prediction.schema";
import { option_label } from "@prisma/client";
import { redis } from "@/lib/redis";

const PlaceBetSchema = z.object({
  predictionId: z.string(),
  optionId: z.nativeEnum(option_label),
  amount: z.number().min(0.01),
});

type PlaceBetInput = z.infer<typeof PlaceBetSchema>;

export async function placeBetAction({
  predictionId,
  optionLabel,
  amount,
}: {
  predictionId: string;
  optionLabel: option_label;
  amount: number;
}): Promise<PlaceBetResponse> {
  const validatedFields = PlaceBetSchema.safeParse({
    predictionId,
    optionId: optionLabel,
    amount,
  });

  if (!validatedFields.success) {
    return PlaceBetResponseSchema.parse({
      success: false,
      message: "Invalid bet data",
    });
  }

  const {
    predictionId: validPredictionId,
    optionId,
    amount: validAmount,
  } = validatedFields.data;

  try {
    // Get current user
    const currentUser = await getCurrentUserAction();
    if (!currentUser) {
      return PlaceBetResponseSchema.parse({
        success: false,
        message: "You must be logged in to place a bet",
      });
    }

    // Check user balance
    const userBalance = await getUserBalanceAction();
    if (!userBalance || Number(userBalance.balance) < validAmount) {
      return PlaceBetResponseSchema.parse({
        success: false,
        message: "Insufficient balance",
      });
    }

    // Get prediction with its template to check if it's still open and get min_bet_amount
    const prediction = await prisma.predictions.findUnique({
      where: {
        id: validPredictionId,
      },
      include: {
        prediction_templates: true,
        stream_matches: {
          include: {
            streamers: true,
          },
        },
      },
    });
    if (!prediction) {
      return PlaceBetResponseSchema.parse({
        success: false,
        message: "Prediction not found",
      });
    }

    if (prediction.state !== "Open") {
      return PlaceBetResponseSchema.parse({
        success: false,
        message: "This prediction is no longer accepting bets",
      });
    }

    if (validAmount < Number(prediction.prediction_templates.min_bet_amount)) {
      return PlaceBetResponseSchema.parse({
        success: false,
        message: `Minimum bet amount is ${prediction.prediction_templates.min_bet_amount}`,
      });
    }

    // Start a transaction to ensure all operations succeed or fail together
    await prisma.$transaction(async (tx) => {
      // Create the user prediction
      const userPrediction = await tx.user_predictions.create({
        data: {
          user_id: currentUser.id,
          prediction_id: validPredictionId,
          option_label: optionId,
          amount: validAmount,
        },
      });

      // Update user balance
      await tx.user_balances.update({
        where: {
          user_id: currentUser.id,
        },
        data: {
          balance: {
            decrement: validAmount,
          },
        },
      });

      // Create transaction record
      const transaction = await tx.user_transactions.create({
        data: {
          user_id: currentUser.id,
          amount: -validAmount,
          description: `Bet on prediction ${prediction.prediction_templates.kind}`,
          type: "Predict",
        },
      });

      // Create user prediction transaction relationship
      await tx.user_prediction_transactions.create({
        data: {
          user_transaction_id: transaction.id,
          user_prediction_id: userPrediction.id,
        },
      });

      // Create user balance transaction relationship
      await tx.user_balance_transactions.create({
        data: {
          user_transaction_id: transaction.id,
          user_balance_id: currentUser.id,
        },
      });
    });

    await redis.publish(
      "match_events:" + prediction.stream_matches.streamer_id + ":bet",
      prediction.id,
    );

    // Revalidate paths to update UI
    revalidatePath("/[streamer]");
    return PlaceBetResponseSchema.parse({
      success: true,
      message: "Bet placed successfully",
    });
  } catch (error) {
    console.error("Error placing bet:", error);
    return PlaceBetResponseSchema.parse({
      success: false,
      message: "An error occurred while placing your bet",
    });
  }
}
