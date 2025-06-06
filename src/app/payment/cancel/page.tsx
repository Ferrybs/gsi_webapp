"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { XCircle } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import cancelUserPaymentAction from "@/actions/payments/cancel-user-payment-action";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CS2 Bits - Pagamento Cancelado",
  description:
    "Uma nova forma de viver o CS2. Aposte, desafie e interaja enquanto assiste seu streamer favorito.",
};

export default function PaymentCancelPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  useEffect(() => {
    const paymentId = searchParams.get("payment_id");

    if (paymentId) {
      cancelUserPaymentAction(paymentId).catch((error) => {
        console.error("Error updating payment status:", error);
      });
    }
  }, [searchParams]);

  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            {t("payment.cancelled")}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-6 py-6">
          <XCircle className="h-16 w-16 text-red-500" />

          <p className="text-center text-muted-foreground">
            {t("payment.cancelled_description")}
          </p>

          <Button onClick={() => router.push("/")} className="mt-4">
            {t("payment.return_home")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
