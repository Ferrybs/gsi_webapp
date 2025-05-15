import { TimelineStatus } from "@/schemas/coinbase-payment-status.schema";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeSince(date: Date) {
  const now = new Date();
  const diffInMinutes = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60),
  );

  if (diffInMinutes < 60) {
    return `${diffInMinutes}min`;
  } else {
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;
    return `${hours}h ${minutes}min`;
  }
}

export function formatCurrency(value: number) {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

  return `${formatted} pts`;
}

export function formatPrice(price: number, currency: string) {
  const currencyMap: Record<string, string> = {
    BRL: "$",
    USD: "$",
    USDC: "USDC $",
  };
  let locate = "pt-BR";
  if (currency === "USD") {
    locate = "en-US";
  } else if (currency === "USDC") {
    locate = "en-US";
  }

  return new Intl.NumberFormat(locate, {
    style: "currency",
    currency: currency === "USDC" ? "USD" : currency,
    currencyDisplay: "symbol",
  })
    .format(Number(price))
    .replace("$", currencyMap[currency] || "$");
}

export function coinbaseGetLastEvent(timeline: TimelineStatus[]) {
  return timeline.reduce((prev, curr) => {
    return new Date(prev.time).getTime() > new Date(curr.time).getTime()
      ? prev
      : curr;
  });
}
