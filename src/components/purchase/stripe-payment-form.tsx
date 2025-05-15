"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface StripePaymentFormProps {
  amount: number;
  currency: string;
  onSubmit: () => Promise<void>;
  isLoading: boolean;
}

export function StripePaymentForm({
  amount,
  currency,
  onSubmit,
  isLoading,
}: StripePaymentFormProps) {
  const { t } = useTranslation();
  const [paymentType, setPaymentType] = useState<"card" | "pix">("card");

  const formatPrice = (price: number, currency: string) => {
    const currencyMap: Record<string, string> = {
      BRL: "R$",
      USD: "$",
      USDC: "USDC",
    };

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency === "USDC" ? "USD" : currency,
      currencyDisplay: "symbol",
    })
      .format(Number(price))
      .replace("$", currencyMap[currency] || "$");
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{t("purchase.payment_details")}</h3>

      <Tabs
        defaultValue="card"
        onValueChange={(value) => setPaymentType(value as "card" | "pix")}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="card">{t("purchase.credit_card")}</TabsTrigger>
          <TabsTrigger value="pix">PIX</TabsTrigger>
        </TabsList>

        <TabsContent value="card">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm">{t("purchase.secure_payment")}</div>
                <div className="flex space-x-2">
                  <div className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center">
                    <Image
                      src="/placeholder.svg?height=24&width=40"
                      alt="Visa"
                      width={24}
                      height={16}
                    />
                  </div>
                  <div className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center">
                    <Image
                      src="/placeholder.svg?height=24&width=40"
                      alt="Mastercard"
                      width={24}
                      height={16}
                    />
                  </div>
                </div>
              </div>

              {/* This would be replaced with actual Stripe Elements in production */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t("purchase.card_number")}
                  </label>
                  <div className="h-10 px-3 py-2 border border-input rounded-md bg-background text-sm">
                    {t("purchase.card_number_placeholder")}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {t("purchase.expiry_date")}
                    </label>
                    <div className="h-10 px-3 py-2 border border-input rounded-md bg-background text-sm">
                      MM/YY
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {t("purchase.cvc")}
                    </label>
                    <div className="h-10 px-3 py-2 border border-input rounded-md bg-background text-sm">
                      CVC
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={onSubmit}
                className="w-full mt-4"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("purchase.processing")}
                  </>
                ) : (
                  t("purchase.pay_amount", {
                    amount: formatPrice(amount, currency),
                  })
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pix">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="text-center">
                <p className="mb-4">{t("purchase.pix_instructions")}</p>
                <div className="bg-gray-100 p-4 rounded-lg mb-4 flex items-center justify-center">
                  <div className="w-32 h-32 bg-gray-200 flex items-center justify-center">
                    <span className="text-sm text-gray-500">
                      {t("purchase.pix_qr_placeholder")}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {t("purchase.pix_copy_instructions")}
                </p>
                <Button
                  variant="outline"
                  className="w-full mb-4"
                  onClick={() => {
                    /* Copy PIX code logic would go here */
                  }}
                >
                  {t("purchase.copy_pix_code")}
                </Button>
              </div>

              <Button
                onClick={onSubmit}
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("purchase.processing")}
                  </>
                ) : (
                  t("purchase.confirm_pix_payment")
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
