"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { purchaseTicketsAction } from "@/actions/raffles/purchase-tickets-action";
import type { RaffleWithSkin } from "@/actions/raffles/get-all-raffles-action";

interface PurchaseModalProps {
  raffle: RaffleWithSkin | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PurchaseModal({ raffle, isOpen, onClose }: PurchaseModalProps) {
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
        onClose();
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

  if (!raffle) return null;

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        hideTitle={true}
        title=""
        className="sm:max-w-md"
        aria-modal="true"
        role="dialog"
        aria-labelledby="purchase-modal-title"
        aria-describedby="purchase-modal-description"
      >
        <DialogHeader>
          <DialogTitle id="purchase-modal-title">
            {t("purchase.buy_tickets")}
          </DialogTitle>
          <DialogDescription id="purchase-modal-description">
            {raffle.skin.market_hash_name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={decrementQuantity}
              disabled={quantity <= 1}
              aria-label={t("purchase.decrease_quantity")}
            >
              <Minus className="h-4 w-4" />
            </Button>

            <div className="text-2xl font-bold min-w-[3rem] text-center">
              {quantity}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={incrementQuantity}
              aria-label={t("purchase.increase_quantity")}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2 text-center">
            <div className="text-sm text-muted-foreground">
              {t("purchase.ticket_price")}: {ticketPrice} {t("common.points")}
            </div>
            <div className="text-lg font-semibold">
              {t("purchase.total")}: {totalPrice} {t("common.points")}
            </div>
            <div className="text-sm text-muted-foreground">
              {t("purchase.balance")}: {userBalance} {t("common.points")}
            </div>
          </div>

          {!canPurchase && userBalance < totalPrice && (
            <div className="text-sm text-destructive text-center">
              {t("purchase.insufficient_balance")}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            onClick={handlePurchase}
            disabled={!canPurchase || purchaseMutation.isPending}
            aria-busy={purchaseMutation.isPending}
          >
            {purchaseMutation.isPending
              ? t("purchase.processing")
              : t("purchase.confirm_purchase")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
