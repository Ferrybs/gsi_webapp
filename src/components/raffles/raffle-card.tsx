"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Clock, Ticket, Minus, Plus, X } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { purchaseTicketsAction } from "@/actions/raffles/purchase-tickets-action";
import type { RaffleWithSkin } from "@/actions/raffles/get-all-raffles-action";

interface RaffleCardProps {
  raffle: RaffleWithSkin;
  isExpanded: boolean;
  onToggleExpansion: (raffleId: string) => void;
}

export function RaffleCard({
  raffle,
  isExpanded,
  onToggleExpansion,
}: RaffleCardProps) {
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState(1);
  const queryClient = useQueryClient();

  const purchaseMutation = useMutation({
    mutationFn: purchaseTicketsAction,
    onSuccess: (response) => {
      if (response.success) {
        toast.success(t("purchase.success"), {
          description: t("purchase.tickets_purchased", { count: quantity }),
        });
        queryClient.invalidateQueries({ queryKey: ["raffles"] });
        onToggleExpansion(raffle.id);
        setQuantity(1);
      } else {
        toast.error(t("purchase.failed"), {
          description: response.error_message || t("purchase.unknown_error"),
        });
      }
    },
    onError: () => {
      toast.error(t("purchase.failed"), {
        description: t("purchase.unknown_error"),
      });
    },
  });

  const getTimeRemaining = (endAt: string) => {
    const now = new Date().getTime();
    const end = new Date(endAt).getTime();
    const diff = end - now;

    if (diff <= 0) return t("raffle.ended");

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return t("raffle.ends_in_hours_minutes", { hours, minutes });
    }
    return t("raffle.ends_in_minutes", { minutes });
  };

  const ticketPrice = Number.parseFloat(raffle.ticket_price);
  const totalPrice = quantity * ticketPrice;
  const userBalance = 5000; // Mock user balance
  const canPurchase = quantity >= 1 && userBalance >= totalPrice;

  const handlePurchase = () => {
    if (!canPurchase) return;
    purchaseMutation.mutate({
      raffle_id: raffle.id,
      quantity,
    });
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  const handleToggle = () => {
    onToggleExpansion(raffle.id);
    if (!isExpanded) {
      setQuantity(1); // Reset quantity when opening
    }
  };

  return (
    <Card
      className={`overflow-hidden transition-all duration-300 ${isExpanded ? "shadow-lg ring-2 ring-primary/20" : "hover:shadow-lg"}`}
    >
      <CardHeader className="p-0">
        <div className="relative aspect-square">
          <Image
            src={
              raffle.skin.image_url || "/placeholder.svg?height=200&width=200"
            }
            alt={raffle.skin.market_hash_name}
            fill
            className="object-cover"
            crossOrigin="anonymous"
          />
          <Badge className="absolute top-2 right-2" variant="secondary">
            {raffle.skin.type}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <h3 className="font-semibold text-sm mb-2 line-clamp-2">
          {raffle.skin.market_hash_name}
        </h3>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {t("raffle.ticket_price")}
            </span>
            <span className="font-medium">
              {raffle.ticket_price} {t("common.points")}
            </span>
          </div>

          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{getTimeRemaining(raffle.end_at)}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          onClick={handleToggle}
          size="sm"
          variant={isExpanded ? "outline" : "default"}
        >
          {isExpanded ? (
            <>
              <X className="h-4 w-4 mr-2" />
              {t("common.cancel")}
            </>
          ) : (
            <>
              <Ticket className="h-4 w-4 mr-2" />
              {t("raffle.buy_tickets")}
            </>
          )}
        </Button>
      </CardFooter>

      {/* Purchase Expansion */}
      <div
        className={`transition-all duration-300 ease-in-out ${isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"} overflow-hidden`}
      >
        <div className="px-4 pb-4">
          <Separator className="mb-4" />

          {/* Item Details */}
          <div className="mb-4">
            <h4 className="font-medium text-sm mb-1">
              {raffle.skin.market_hash_name}
            </h4>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{raffle.skin.exterior}</span>
              <Badge variant="outline" className="text-xs">
                {raffle.skin.type}
              </Badge>
            </div>
          </div>

          {/* Balance and Price Info */}
          <div className="bg-muted/50 rounded-lg p-3 mb-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {t("purchase.ticket_price")}
              </span>
              <span className="font-medium">
                {ticketPrice} {t("common.points")}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {t("purchase.balance")}
              </span>
              <span className="font-medium text-green-600">
                {userBalance} {t("common.points")}
              </span>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="mb-4">
            <label className="text-sm font-medium mb-2 block">
              {t("purchase.quantity")}
            </label>
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                aria-label={t("purchase.decrease_quantity")}
              >
                <Minus className="h-3 w-3" />
              </Button>

              <div className="bg-background border rounded-lg px-4 py-2 min-w-[3rem] text-center font-semibold">
                {quantity}
              </div>

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={incrementQuantity}
                aria-label={t("purchase.increase_quantity")}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Total Cost */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{t("purchase.total")}</span>
              <span className="text-lg font-bold text-primary">
                {totalPrice} {t("common.points")}
              </span>
            </div>
          </div>

          {/* Insufficient Balance Warning */}
          {!canPurchase && userBalance < totalPrice && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mb-4">
              <p className="text-sm text-destructive font-medium">
                {t("purchase.insufficient_balance")}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={handleToggle}>
              {t("common.cancel")}
            </Button>
            <Button
              className="flex-1"
              onClick={handlePurchase}
              disabled={!canPurchase || purchaseMutation.isPending}
              aria-busy={purchaseMutation.isPending}
            >
              {purchaseMutation.isPending
                ? t("purchase.processing")
                : t("purchase.confirm_purchase")}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
