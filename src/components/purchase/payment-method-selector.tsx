"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useTranslation } from "react-i18next";

interface PaymentMethodSelectorProps {
  selected: "stripe" | "coinbase";
  onSelect: (method: "stripe" | "coinbase") => void;
}

export function PaymentMethodSelector({
  selected,
  onSelect,
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
            {t("purchase.credit_card_pix")}
          </TabsTrigger>
          <TabsTrigger value="coinbase">
            {t("purchase.crypto_usdt")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="stripe">
          <Card>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  {t("purchase.pay_with_card_or_pix")}
                </div>
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
                  <div className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center">
                    <Image
                      src="/placeholder.svg?height=24&width=40"
                      alt="PIX"
                      width={24}
                      height={16}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="coinbase">
          <Card>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm">{t("purchase.pay_with_usdt")}</div>
                <div className="flex space-x-2">
                  <div className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center">
                    <Image
                      src="/placeholder.svg?height=24&width=40"
                      alt="USDC"
                      width={24}
                      height={16}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
