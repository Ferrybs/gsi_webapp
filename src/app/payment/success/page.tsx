"use client";

import { use, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { processUserPaymentSuccessAction } from "@/actions/payments/process-user-payment-success-action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, CircleX, Loader2 } from "lucide-react";
import { PaymentStatus } from "@/schemas/user-payment.schema";
import { useTranslation } from "react-i18next";
import { getUserPaymentDataAction } from "@/actions/payments/get-user-payment-data-action";
import { ProcessPaymentResponse } from "@/schemas/handle-payment.schema";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("Pending");
  const [message, setMessage] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    const paymentId = searchParams.get("payment_id");

    const setParms = ({
      status,
      message,
    }: {
      status: PaymentStatus;
      message: string;
    }) => {
      setMessage(
        message
          ? status === "Processing"
            ? "payment.processing_description"
            : status === "Completed"
              ? "payment.processed_successfully"
              : status === "Failed"
                ? "payment.failed_description"
                : status === "Canceled"
                  ? "payment.cancelled_description"
                  : message
          : "error.failed_to_process_payment",
      );
      setPaymentStatus(status);
    };

    if (!paymentId) {
      setParms({
        status: "Pending",
        message: "error.invalid_payment_id",
      });
      return;
    }

    const fetchPaymentData = async () => {
      const response = await getUserPaymentDataAction(paymentId);
      if (response.success && response.data) {
        const payment = response.data;
        if (payment.status === "Completed") {
          setParms({
            status: "Completed",
            message: "payment.processed_successfully",
          });
          setIsProcessing(false);
          location.reload();
        }
      } else {
        setIsProcessing(false);
        setParms({
          status: "Pending",
          message: "error.invalid_payment_id",
        });
      }
    };
    let intervalId: NodeJS.Timeout | undefined;
    if (paymentStatus === "Processing" || paymentStatus === "Pending") {
      intervalId = setInterval(() => {
        fetchPaymentData();
      }, 3000);
    }

    const processPayment = async () => {
      try {
        const response = await processUserPaymentSuccessAction(paymentId);
        let result: ProcessPaymentResponse = {
          payment_status: "Pending",
          message: "error.failed_to_process_payment",
        };
        if (response.success && response.data) {
          result = response.data;
        }
        setParms({
          status: result.payment_status,
          message: result.message,
        });
      } catch (error) {
        console.error("Error processing payment:", error);
      } finally {
        setIsProcessing(false);
      }
    };
    if (paymentStatus === "Pending") {
      processPayment();
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [searchParams, paymentStatus]);

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
