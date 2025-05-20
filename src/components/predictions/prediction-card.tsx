"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { useSession } from "next-auth/react";
import { placeBetAction } from "@/actions/predictions/place-bet-action";
import { PredictionOption } from "./prediction-option";
import { Clock, Users, Trophy, AlertCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { getUserBalanceAction } from "@/actions/user/get-user-balance-action";
import type { EnhancedPrediction } from "@/schemas/prediction.schema";
import { formatTimeSince } from "@/lib/utils";

interface PredictionCardProps {
  prediction: EnhancedPrediction;
  currentRound: number;
}

export function PredictionCard({
  prediction,
  currentRound,
}: PredictionCardProps) {
  const { t, i18n } = useTranslation();
  const { data: session } = useSession();
  const [betAmount, setBetAmount] = useState<string>("");
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userBalance, setUserBalance] = useState<number>(0);

  const isOpen = prediction.state === "Open";
  const isResolved = prediction.state === "Resolved";
  const isClosed = prediction.state === "Closed";
  const isCanceled = prediction.state === "Canceled";

  const isRoundThresholdReached =
    currentRound >= prediction.prediction_templates.threshold_round;

  const userHasBet = prediction.userTotalBets > 0;

  const parsedBetAmount = Number.parseFloat(betAmount || "0");
  const hasInsufficientBalance = parsedBetAmount > userBalance;
  const isBelowMinimum =
    parsedBetAmount < prediction.prediction_templates.min_bet_amount;

  // Fetch user balance
  useEffect(() => {
    if (session) {
      getUserBalanceAction().then((balance) => {
        if (balance) {
          setUserBalance(Number(balance.balance));
        }
      });
    }
  }, [session]);

  const handleSelectOption = (optionId: string) => {
    if (!isOpen) return;
    setSelectedOptionId(optionId);
  };

  const handleBetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and one decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setBetAmount(value);
    }
  };

  const handlePlaceBet = async () => {
    if (!session) {
      toast.error(t("user.login_required"), {
        description: t("predictions.login_to_bet"),
      });
      return;
    }

    if (!selectedOptionId) {
      toast.error(t("predictions.select_option"), {
        description: t("predictions.select_option_description"),
      });
      return;
    }

    const amount = Number.parseFloat(betAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error(t("predictions.invalid_amount"), {
        description: t("predictions.enter_valid_amount"),
      });
      return;
    }

    if (amount < prediction.prediction_templates.min_bet_amount) {
      toast.error(t("predictions.minimum_bet"), {
        description: t("predictions.minimum_bet_description", {
          amount: prediction.prediction_templates.min_bet_amount,
        }),
      });
      return;
    }

    if (amount > userBalance) {
      toast.error(t("user.insufficient_balance"), {
        description: t("predictions.insufficient_balance_description"),
      });
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("predictionId", prediction.id);
    formData.append("optionId", selectedOptionId);
    formData.append("amount", amount.toString());

    const result = await placeBetAction(formData);

    setIsSubmitting(false);

    if (result.success) {
      toast.success(t("predictions.bet_placed"), {
        description: result.message,
      });
      setBetAmount("");
      setSelectedOptionId(null);

      // Update user balance after successful bet
      const updatedBalance = await getUserBalanceAction();
      if (updatedBalance) {
        setUserBalance(Number(updatedBalance.balance));
      }
    } else {
      toast.error(t("predictions.bet_failed"), {
        description: result.message,
      });
    }
  };

  const getStatusBadge = () => {
    if (isResolved) {
      return <Badge>{t("predictions.resolved")}</Badge>;
    } else if (isClosed) {
      return <Badge variant="secondary">{t("predictions.closed")}</Badge>;
    } else if (isCanceled) {
      return <Badge variant="destructive">{t("predictions.canceled")}</Badge>;
    } else if (isRoundThresholdReached) {
      return <Badge>{t("predictions.ending_soon")}</Badge>;
    } else {
      return <Badge variant="default">{t("predictions.open")}</Badge>;
    }
  };

  // Reset selected option and bet amount when prediction state changes
  useEffect(() => {
    if (!isOpen) {
      setSelectedOptionId(null);
      setBetAmount("");
    }
  }, [isOpen]);

  // Add quick bet buttons
  const quickBetAmounts = [10, 50, 100];
  const handleQuickBet = (amount: number) => {
    setBetAmount(amount.toString());
  };

  const handleAllIn = () => {
    setBetAmount(userBalance.toString());
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold">
            {t(`predictions.${prediction.prediction_templates.kind}`)}
          </CardTitle>
          {getStatusBadge()}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
          <Clock size={14} />
          <span>{formatTimeSince(prediction.created_at)}</span>
          {isOpen && !isRoundThresholdReached && (
            <>
              <span className="mx-1">•</span>
              <AlertCircle size={14} />
              <span>
                {t("predictions.closes_at_round", {
                  round: prediction.prediction_templates.threshold_round,
                })}
              </span>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {prediction.options.map((option) => (
            <PredictionOption
              key={option.id}
              option={option}
              isSelected={selectedOptionId === option.id}
              isWinner={
                isResolved && prediction.winning_option_id === option.id
              }
              onClick={() => handleSelectOption(option.id)}
              disabled={!isOpen}
            />
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users size={14} />
            <span>
              {prediction.totalBets} {t("predictions.bets")}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Trophy size={14} />
            <span>
              {t("predictions.total_pool")}: {prediction.totalAmount.toFixed(2)}
            </span>
          </div>
        </div>

        {isOpen && (
          <div className="space-y-2 pt-2 border-t">
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder={t("predictions.enter_amount")}
                value={betAmount}
                onChange={handleBetAmountChange}
                className={`flex-1 ${hasInsufficientBalance ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                disabled={!selectedOptionId || isSubmitting}
                min={prediction.prediction_templates.min_bet_amount}
              />
              <Button
                onClick={handlePlaceBet}
                disabled={
                  !selectedOptionId ||
                  !betAmount ||
                  isSubmitting ||
                  hasInsufficientBalance ||
                  isBelowMinimum
                }
                className="whitespace-nowrap"
              >
                {t("predictions.place_bet")}
              </Button>
            </div>

            {/* Quick bet buttons */}
            <div className="flex gap-2 mt-2">
              {quickBetAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickBet(amount)}
                  disabled={
                    !selectedOptionId || isSubmitting || amount > userBalance
                  }
                  className="flex-1"
                >
                  {amount}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={handleAllIn}
                disabled={!selectedOptionId || isSubmitting || userBalance <= 0}
                className="flex-1"
              >
                {t("predictions.all_in")}
              </Button>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-xs text-muted-foreground">
                {t("predictions.min_bet")}:{" "}
                {prediction.prediction_templates.min_bet_amount}
              </p>

              {hasInsufficientBalance && betAmount && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertTriangle size={12} />
                  {t("user.insufficient_balance")}
                </p>
              )}

              {isBelowMinimum && betAmount && (
                <p className="text-xs text-amber-500 flex items-center gap-1">
                  <AlertTriangle size={12} />
                  {t("predictions.below_minimum")}
                </p>
              )}
            </div>
          </div>
        )}

        {userHasBet && (
          <div className="pt-2 border-t">
            <p className="text-sm font-medium">
              {t("predictions.your_bets")}:{" "}
              {prediction.userTotalBets.toFixed(2)}
            </p>
          </div>
        )}

        {isResolved && prediction.winning_option_id && (
          <div className="pt-2 border-t">
            <p className="text-sm font-medium text-green-500">
              {t("predictions.winner")}:{" "}
              {
                prediction.options.find(
                  (o) => o.id === prediction.winning_option_id,
                )?.label
              }
            </p>
          </div>
        )}

        {isCanceled && (
          <div className="pt-2 border-t">
            <p className="text-sm font-medium text-muted-foreground">
              {t("predictions.canceled_description")}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
