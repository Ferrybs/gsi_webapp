"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { SiVisa } from "react-icons/si";
import {
  FaBitcoin,
  FaCcApplePay,
  FaCcMastercard,
  FaGooglePay,
} from "react-icons/fa";
import { TokenETH, TokenUSDC, TokenUSDT } from "@web3icons/react";
interface PaymentMethodSelectorProps {
  selected: "stripe" | "coinbase";
  onSelect: (method: "stripe" | "coinbase") => void;
  showStripeForm?: boolean;
  stripeFormContent?: React.ReactNode;
}

export function PaymentMethodSelector({
  selected,
  onSelect,
  showStripeForm = false,
  stripeFormContent,
}: PaymentMethodSelectorProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{t("purchase.payment_method")}</h3>
      <Tabs
        defaultValue={selected}
        onValueChange={(value) => onSelect(value as "stripe" | "coinbase")}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stripe">
            {t("purchase.pay_with_card_or_pix")}
          </TabsTrigger>
          <TabsTrigger value="coinbase">
            {t("purchase.crypto_usdc")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="stripe">
          <Card>
            <CardContent className=" space-y-4">
              <div className="flex items-center w-full max-h-9 justify-between">
                <div className="flex w-full space-x-4">
                  <SiVisa className="flex-1 h-full" />
                  <FaCcMastercard className="flex-1 h-full" />
                  <FaGooglePay className="flex-1 h-full" />
                  <FaCcApplePay className="flex-1 h-full" />
                </div>
              </div>
              {showStripeForm && stripeFormContent && (
                <div className="mt-4">{stripeFormContent}</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="coinbase">
          <Card>
            <CardContent className="space-y-4">
              <div className="flex items-center w-full max-h-9 justify-between">
                <div className="flex w-full space-x-4">
                  <FaBitcoin className="flex-1 h-full" />
                  <TokenETH
                    variant="mono"
                    color="#FFFFFF"
                    className="flex-1 h-full"
                  />
                  <TokenUSDC
                    variant="mono"
                    color="#FFFFFF"
                    className="flex-1 h-full"
                  />
                  <TokenUSDT
                    variant="mono"
                    color="#FFFFFF"
                    className="flex-1 h-full"
                  />
                  {/* <SiCoinbase className="flex-1 h-full" /> */}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
