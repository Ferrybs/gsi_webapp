"use client";

import { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { processUserPaymentSuccessAction } from "@/actions/payments/process-user-payment-success-action";
import cancelUserPaymentAction from "@/actions/payments/cancel-user-payment-action";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUserAction } from "@/actions/user/get-current-user-action";

interface StripePaymentFormProps {
  paymentId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function StripePaymentForm({
  paymentId,
  onSuccess,
  onCancel,
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await getCurrentUserAction();
      if (response.success) {
        return response.data;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    handleInternalConfirm();
  };

  const handleInternalConfirm = async () => {
    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      const session = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success?payment_id=${paymentId}`,
        },
        redirect: "if_required",
      });

      if (session.error) {
        if (
          session.error.type === "card_error" ||
          session.error.type === "validation_error"
        ) {
          toast.error(session.error.message || t("purchase.payment_error"));
        } else {
          toast.error(t("purchase.unexpected_error"));
        }
      } else {
        if (!session.paymentIntent) {
          toast.error(t("purchase.unexpected_error"));
          return;
        }
        if (session.paymentIntent.next_action?.redirect_to_url?.url) {
          window.location.href =
            session.paymentIntent.next_action.redirect_to_url.url;
        }
        const result = await processUserPaymentSuccessAction(paymentId);
        if (result.success) {
          toast.success(t("payment.processed_successfully"));
          onSuccess();
        } else {
          toast.error(t(result.error_message || "purchase.payment_error"));
        }
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(t("purchase.unexpected_error"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      const result = await cancelUserPaymentAction(paymentId);
      if (result.success) {
        toast.success(t("payment.cancelled_description"));
        onCancel();
      } else {
        toast.error(
          t(result.error_message || "error.payment_cancellation_failed")
        );
      }
    } catch (error) {
      console.error("Cancel error:", error);
      toast.error(t("error.payment_cancellation_failed"));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* <ExpressCheckoutElement
        onConfirm={onConfirmExpressCheckout}
        onCancel={handleCancel}
      />
      <LinkAuthenticationElement
        options={{ defaultValues: { email: user?.email ?? "" } }}
      /> */}
      <PaymentElement
        id="payment-element"
        options={{
          fields: {
            billingDetails: {
              email: "auto",
            },
          },
          defaultValues: {
            billingDetails: {
              email: user?.email ?? "",
            },
          },
          wallets: {
            googlePay: "auto",
            applePay: "auto",
            link: "auto",
          },
          layout: {
            type: "accordion",
            defaultCollapsed: true,
          },
        }}
      />
      <div className="flex space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isLoading}
          className="flex-1"
        >
          {t("purchase.cancel")}
        </Button>

        <Button
          type="submit"
          disabled={!stripe || isLoading}
          className="flex-1"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("purchase.processing")}
            </>
          ) : (
            t("purchase.pay_now")
          )}
        </Button>
      </div>
    </form>
  );
}
