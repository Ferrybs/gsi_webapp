"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUserAction } from "../user/get-current-user-action";
import {
  type EnhancedPrediction,
  EnhancedPredictionSchema,
  UserPrediction,
} from "@/schemas/prediction.schema";

export async function getPredictionsAction(
  matchId: string,
): Promise<EnhancedPrediction[]> {
  try {
    const match_stream = await prisma.stream_matches.findUnique({
      where: {
        match_id: matchId,
      },
    });
    if (!match_stream) {
      return [];
    }
    // Get predictions for the match with their templates and options
    const predictions = await prisma.predictions.findMany({
      where: {
        stream_match_id: match_stream.id,
      },
      include: {
        prediction_templates: {
          include: {
            prediction_options: true,
          },
        },
        user_predictions: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    // Get current user
    const currentUser = await getCurrentUserAction();

    // Process predictions with or without user data
    const processedPredictions = await Promise.all(
      predictions.map(async (prediction) => {
        // Get user bets if user is logged in
        let userPredictions: UserPrediction[] = [];
        if (currentUser) {
          userPredictions = await prisma.user_predictions
            .findMany({
              where: {
                prediction_id: prediction.id,
                user_id: currentUser.id,
              },
            })
            .then((userBets) =>
              userBets.map((bet) => ({
                ...bet,
                amount: Number(bet.amount),
              })),
            );
        }

        // Get options from the template
        const options =
          prediction.prediction_templates.prediction_options || [];
        const allBets = prediction.user_predictions || [];

        // Calculate totals
        const totalBets = allBets.length;
        const totalAmount = allBets.reduce(
          (sum, bet) => sum + Number(bet.amount),
          0,
        );

        // Calculate per option
        const optionsWithStats = options.map((option) => {
          const optionBets = allBets.filter(
            (bet) => bet.option_label === option.label,
          );
          const optionAmount = optionBets.reduce(
            (sum, bet) => sum + Number(bet.amount),
            0,
          );
          const optionBetCount = optionBets.length;
          const percentage =
            totalAmount > 0 ? (optionAmount / totalAmount) * 100 : 0;

          // Calculate odds (1:X format)
          const odds =
            totalAmount > 0 && optionAmount > 0
              ? (totalAmount - optionAmount) / optionAmount
              : 0;

          // User's bets on this option
          const userBetsOnOption = userPredictions
            .filter((bet) => bet.option_label === option.label)
            .reduce((sum, bet) => sum + Number(bet.amount), 0);

          return {
            ...option,
            betCount: optionBetCount,
            amount: optionAmount,
            percentage,
            odds,
            userAmount: userBetsOnOption,
          };
        });

        // User's total bets on this prediction
        const userTotalBets = userPredictions.reduce(
          (sum, bet) => sum + Number(bet.amount),
          0,
        );
        const enhancedPrediction = {
          ...prediction,
          totalBets,
          totalAmount,
          options: optionsWithStats,
          userTotalBets,
          user_bets: userPredictions,
        };

        // Validate with Zod schema
        return EnhancedPredictionSchema.parse(enhancedPrediction);
      }),
    );

    return processedPredictions;
  } catch (error) {
    console.error("Error fetching predictions:", error);
    return [];
  }
}
