"use client";

import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Clock, Ticket, Minus, Plus, X } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
  const [expandedHeight, setExpandedHeight] = useState(0);
  const expandedContentRef = useRef<HTMLDivElement>(null);
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

  // Calculate the height of expanded content for smooth animation
  useEffect(() => {
    if (expandedContentRef.current && isExpanded) {
      const height = expandedContentRef.current.scrollHeight;
      setExpandedHeight(height);
    } else {
      setExpandedHeight(0);
    }
  }, [isExpanded, quantity]);

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

  // Determine the exterior color class based on the skin's exterior/rarity
  const getRarityGradient = () => {
    switch (raffle.skin.exterior) {
      case "FactoryNew":
        return "from-blue-500/25 via-blue-400/20 to-blue-600/30";
      case "MinimalWear":
        return "from-purple-500/25 via-purple-400/20 to-purple-600/30";
      case "FieldTested":
        return "from-green-500/25 via-green-400/20 to-green-600/30";
      case "WellWorn":
        return "from-yellow-500/25 via-yellow-400/20 to-yellow-600/30";
      case "BattleScarred":
        return "from-red-500/25 via-red-400/20 to-red-600/30";
      default:
        return "from-gray-500/25 via-gray-400/20 to-gray-600/30";
    }
  };

  return (
    <Card
      className={`overflow-hidden transition-all duration-300 border-2 ${
        isExpanded ? "shadow-lg" : "hover:shadow-md"
      }`}
      style={{
        borderColor:
          raffle.skin.exterior === "FactoryNew"
            ? "#3b82f6"
            : raffle.skin.exterior === "MinimalWear"
              ? "#8b5cf6"
              : raffle.skin.exterior === "FieldTested"
                ? "#10b981"
                : raffle.skin.exterior === "WellWorn"
                  ? "#f59e0b"
                  : raffle.skin.exterior === "BattleScarred"
                    ? "#ef4444"
                    : "#6b7280",
      }}
    >
      <div className="flex flex-col h-full">
        {/* Card Content with Image and Info */}
        <CardContent className="p-0 flex-1 flex flex-col">
          {/* Image Section with Rarity Gradient Background */}
          <div className="relative w-full h-32 overflow-hidden rounded-lg">
            {/* Base background */}
            <div className="absolute inset-0 bg-gradient-to-br from-background/50 to-muted/80"></div>

            {/* Rarity gradient overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${getRarityGradient()}`}
            ></div>

            {/* Subtle pattern overlay for texture */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px] opacity-30"></div>

            {/* Image container */}
            <div className="absolute inset-0 flex items-center justify-center p-3 z-10">
              <Image
                src={
                  raffle.skin.image_url ||
                  "/placeholder.svg?height=200&width=200"
                }
                alt={raffle.skin.market_hash_name}
                width={160}
                height={120}
                className="object-contain max-h-28 drop-shadow-lg filter brightness-105"
                crossOrigin="anonymous"
              />
            </div>

            {/* Type badge with better visibility */}
            <Badge className="absolute top-2 right-2 z-20 bg-black/80 text-white border-white/20 backdrop-blur-sm hover:bg-black/90">
              {raffle.skin.type}
            </Badge>
          </div>

          {/* Info Section - Fixed content that doesn't expand */}
          <div className="p-3 flex-1 flex flex-col bg-gradient-to-b from-background to-background/95">
            <h3 className="font-medium text-sm mb-1 line-clamp-1">
              {raffle.skin.market_hash_name}
            </h3>
            <p className="text-xs text-muted-foreground mb-2 font-medium">
              {raffle.skin.exterior}
            </p>

            <div className="mt-auto space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {t("raffle.ticket_price")}
                </span>
                <span className="font-semibold">
                  {raffle.ticket_price} {t("common.points")}
                </span>
              </div>

              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{getTimeRemaining(raffle.end_at)}</span>
              </div>
            </div>
          </div>
        </CardContent>

        {/* Card Footer - Fixed content that doesn't expand */}
        <CardFooter className="p-3 pt-0 bg-gradient-to-b from-background/95 to-background">
          <Button
            className="w-full transition-all duration-200"
            onClick={handleToggle}
            size="sm"
            variant={isExpanded ? "outline" : "default"}
          >
            {isExpanded ? (
              <>
                <X className="h-4 w-4 mr-1.5" />
                {t("common.cancel")}
              </>
            ) : (
              <>
                <Ticket className="h-4 w-4 mr-1.5" />
                {t("raffle.buy_tickets")}
              </>
            )}
          </Button>
        </CardFooter>

        {/* Purchase Expansion - Only expands below the button */}
        <div
          className="transition-all duration-300 ease-in-out overflow-hidden bg-gradient-to-b from-background to-muted/20"
          style={{
            height: isExpanded ? `${expandedHeight}px` : "0px",
            opacity: isExpanded ? 1 : 0,
          }}
        >
          <div ref={expandedContentRef} className="px-3 pb-3">
            <Separator className="mb-3" />

            {/* Balance and Price Info */}
            <div className="bg-muted/50 backdrop-blur-sm rounded-lg p-2.5 mb-3 space-y-1.5 border border-border/50">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">
                  {t("purchase.ticket_price")}
                </span>
                <span className="font-medium">
                  {ticketPrice} {t("common.points")}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">
                  {t("purchase.balance")}
                </span>
                <span className="font-medium text-green-600">
                  {userBalance} {t("common.points")}
                </span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-3">
              <label className="text-xs font-medium mb-1.5 block">
                {t("purchase.quantity")}
              </label>
              <div className="flex items-center justify-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 rounded-full transition-all duration-200 hover:scale-105"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  aria-label={t("purchase.decrease_quantity")}
                >
                  <Minus className="h-3 w-3" />
                </Button>

                <div className="bg-background border rounded-lg px-3 py-1.5 min-w-[2.5rem] text-center font-semibold text-sm shadow-sm">
                  {quantity}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 rounded-full transition-all duration-200 hover:scale-105"
                  onClick={incrementQuantity}
                  aria-label={t("purchase.increase_quantity")}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Total Cost */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-2.5 mb-3 backdrop-blur-sm">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium">
                  {t("purchase.total")}
                </span>
                <span className="text-base font-bold text-primary">
                  {totalPrice} {t("common.points")}
                </span>
              </div>
            </div>

            {/* Insufficient Balance Warning */}
            {!canPurchase && userBalance < totalPrice && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-2.5 mb-3 backdrop-blur-sm">
                <p className="text-xs text-destructive font-medium">
                  {t("purchase.insufficient_balance")}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 text-xs py-2 transition-all duration-200 hover:bg-muted"
                onClick={handleToggle}
              >
                {t("common.cancel")}
              </Button>
              <Button
                className="flex-1 text-xs py-2 transition-all duration-200 hover:shadow-md"
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
      </div>
    </Card>
  );
}
