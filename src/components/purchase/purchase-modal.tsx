"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { getPointPackagesAction } from "@/actions/packages/get-point-packages-action";
import type { PointPackage } from "@/schemas/point-package.schema";
import { Loader2, ArrowRight, CheckCircle } from "lucide-react";
import { formatCurrency, formatPrice } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import createPaymentAction from "@/actions/payments/create-payment-action";

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PurchaseModal({ isOpen, onClose }: PurchaseModalProps) {
  const { t } = useTranslation();
  const [packages, setPackages] = useState<PointPackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<PointPackage | null>(
    null,
  );
  const [paymentMethod, setPaymentMethod] = useState<"Stripe" | "Coinbase">(
    "Stripe",
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      loadPackages();
    }
  }, [isOpen]);

  const loadPackages = async () => {
    const pointPackages = await getPointPackagesAction();
    setPackages(pointPackages);
    if (pointPackages.length > 0) {
      setSelectedPackage(null); // Start with no package selected
    }
  };

  useEffect(() => {
    if (selectedPackage) {
      if (selectedPackage.currency === "USDC") {
        setPaymentMethod("Coinbase");
      }
    }
  }, [selectedPackage]);

  const calculateBonusPercentage = (pkg: PointPackage) => {
    if (pkg.bonus_points === 0) return 0;
    return Math.round((pkg.bonus_points / pkg.points_amount) * 100);
  };

  const handlePurchase = async () => {
    if (!selectedPackage) {
      toast.error(t("purchase.select_package_error"));
      return;
    }

    setIsLoading(true);

    try {
      const paymentData = {
        packageId: selectedPackage.id,
        provider: paymentMethod,
      };

      const result = await createPaymentAction(paymentData);

      if (result.success && result.data) {
        window.location.href = result.data.url;
      } else {
        toast.error(
          result.error_message
            ? t(result.error_message)
            : t("purchase.payment_error"),
        );
      }
    } catch (error) {
      console.error("Error creating payment:", error);
      toast.error(t("purchase.unexpected_error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col p-0"
        title=""
      >
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl font-bold text-center">
            {t("purchase.title")}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Package Selection - Left Side */}
          <div className="md:w-3/5 p-6 overflow-y-auto border-r border-border">
            <h3 className="text-lg font-medium mb-4">
              {t("purchase.select_package")}
            </h3>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>{t("purchase.points")}</TableHead>
                    <TableHead>{t("purchase.bonus")}</TableHead>
                    <TableHead>{t("purchase.price")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {packages.map((pkg) => {
                    const bonusPercentage = calculateBonusPercentage(pkg);
                    const isSelected = selectedPackage?.id === pkg.id;

                    return (
                      <TableRow
                        key={pkg.id}
                        className={`cursor-pointer ${isSelected ? "bg-primary/5" : ""}`}
                        onClick={() => setSelectedPackage(pkg)}
                      >
                        <TableCell>
                          <div className="flex items-center justify-center">
                            {isSelected ? (
                              <CheckCircle className="h-5 w-5 text-primary" />
                            ) : (
                              <div className="h-5 w-5 rounded-full border border-muted-foreground" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span className="font-bold">
                              {formatCurrency(pkg.points_amount)}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {pkg.points_amount} {t("purchase.points_label")}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {bonusPercentage > 0 ? (
                            <div className="flex flex-col">
                              <Badge className="w-fit bg-green-500 mb-1">
                                +{bonusPercentage}%
                              </Badge>
                              <span className="text-sm text-green-500">
                                +{pkg.bonus_points} {t("purchase.bonus_points")}
                              </span>
                            </div>
                          ) : (
                            <span>-</span>
                          )}
                        </TableCell>
                        <TableCell className="font-bold">
                          {formatPrice(pkg.price, pkg.currency)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Payment Methods - Right Side */}
          <div className="md:w-2/5 p-6 overflow-y-auto">
            <h3 className="text-lg font-medium mb-4">
              {t("purchase.payment_method")}
            </h3>

            <RadioGroup
              value={paymentMethod}
              onValueChange={(value) =>
                setPaymentMethod(value as "Stripe" | "Coinbase")
              }
              className="space-y-4 mb-6"
            >
              <div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="Stripe"
                    id="Stripe"
                    disabled={selectedPackage?.currency === "USDC"}
                  />
                  <Label htmlFor="Stripe" className="font-medium">
                    {t("purchase.credit_card")}
                  </Label>
                </div>
                <div className="pl-6 mt-2 text-sm text-muted-foreground">
                  {t("purchase.credit_card_description")}
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Coinbase" id="Coinbase" />
                  <Label htmlFor="Coinbase" className="font-medium">
                    {t("purchase.crypto_usdt")}
                  </Label>
                </div>
                <div className="pl-6 mt-2 text-sm text-muted-foreground">
                  {t("purchase.crypto_description")}
                </div>
              </div>
            </RadioGroup>

            {selectedPackage && (
              <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                <h4 className="font-medium mb-2">{t("purchase.summary")}</h4>
                <div className="flex justify-between mb-1">
                  <span>{t("purchase.selected_package")}:</span>
                  <span className="font-bold">
                    {formatCurrency(selectedPackage.points_amount)}
                  </span>
                </div>

                {selectedPackage.bonus_points > 0 && (
                  <div className="flex justify-between mb-1 text-green-500">
                    <span>{t("purchase.package_bonus")}:</span>
                    <span>+{formatCurrency(selectedPackage.bonus_points)}</span>
                  </div>
                )}

                <div className="border-t border-border mt-2 pt-2 flex justify-between font-bold">
                  <span>{t("purchase.total_price")}:</span>
                  <span>
                    {formatPrice(
                      selectedPackage.price,
                      selectedPackage.currency,
                    )}
                  </span>
                </div>
              </div>
            )}

            <Button
              onClick={handlePurchase}
              className="w-full mt-6 py-6 text-lg"
              disabled={isLoading || !selectedPackage}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {t("purchase.processing")}
                </>
              ) : (
                <>
                  {t("purchase.proceed_to_payment")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
