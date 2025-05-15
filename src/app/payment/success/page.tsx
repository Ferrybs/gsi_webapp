"use client";

import { use, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { processUserPaymentSuccessAction } from "@/actions/payments/process-user-payment-success-action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, CircleX, Loader2 } from "lucide-react";
import { PaymentStatus } from "@/schemas/user-payment.schema";
import { useTranslation } from "react-i18next";
import { getUserPaymentData } from "@/actions/payments/get-user-payment-data";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("Pending");
  const [message, setMessage] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    const fetchPaymentData = async () => {
      const paymentId = searchParams.get("payment_id");
      if (!paymentId) {
        setIsProcessing(false);
        setPaymentStatus("Pending");
        setMessage("error.invalid_payment_id");
        return;
      }
      const payment = await getUserPaymentData(paymentId);
      if (payment) {
        setPaymentStatus(payment.status);
        setMessage(
          payment.status === "Completed"
            ? "payment.processed_successfully"
            : payment.status === "Failed"
              ? "payment.failed_description"
              : payment.status === "Canceled"
                ? "payment.cancelled_description"
                : "payment.already_processed",
        );
        setIsProcessing(false);
      } else {
        setIsProcessing(false);
        setPaymentStatus("Pending");
        setMessage("error.invalid_payment_id");
      }
    };
    setTimeout(() => {
      if (
        paymentStatus !== "Completed" &&
        paymentStatus !== "Failed" &&
        paymentStatus !== "Canceled"
      ) {
        fetchPaymentData();
      }
    }, 5000);
  }, [searchParams]);

  useEffect(() => {
    const paymentId = searchParams.get("payment_id");

    if (!paymentId) {
      setIsProcessing(false);
      setPaymentStatus("Pending");
      setMessage("error.invalid_payment_id");
      return;
    }

    const processPayment = async () => {
      try {
        const result = await processUserPaymentSuccessAction(paymentId);

        setPaymentStatus(result.payment_status ?? "Pending");
        setMessage(
          result.message
            ? result.payment_status === "Processing"
              ? "payment.processing_description"
              : result.payment_status === "Completed"
                ? "payment.processed_successfully"
                : result.payment_status === "Failed"
                  ? "payment.failed_description"
                  : result.payment_status === "Canceled"
                    ? "payment.cancelled_description"
                    : result.message
            : "error.failed_to_process_payment",
        );
      } catch (error) {
        console.error("Error processing payment:", error);
        setPaymentStatus("Failed");
        setMessage("error.failed_to_process_payment");
      } finally {
        setIsProcessing(false);
      }
    };

    processPayment();
  }, [searchParams]);

  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            {isProcessing
              ? t("payment.processing")
              : paymentStatus === "Completed"
                ? t("payment.success")
                : paymentStatus === "Processing"
                  ? t("payment.processing")
                  : paymentStatus === "Failed" ||
                      paymentStatus === "Canceled" ||
                      paymentStatus === "Refunded"
                    ? t("payment.failed")
                    : t("payment.processing")}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-6 py-6">
          {isProcessing || paymentStatus === "Processing" ? (
            <Loader2 className="h-16 w-16 text-primary animate-spin" />
          ) : paymentStatus === "Completed" ? (
            <CheckCircle className="h-16 w-16 text-green-500" />
          ) : (
            <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
              <CircleX className="h-16 w-16 text-red-500" />
            </div>
          )}

          <p className="text-center text-muted-foreground">
            {isProcessing ? t("payment.processing_description") : t(message)}
          </p>

          {!isProcessing && (
            <Button onClick={() => router.push("/")} className="mt-4">
              {t("payment.return_to_home")}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
