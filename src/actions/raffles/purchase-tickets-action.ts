"use server";

import type { ActionResponse } from "@/types/action-response";
import {
  type PurchaseTicketsInput,
  PurchaseTicketsSchema,
} from "@/schemas/raffle.schema";

export async function purchaseTicketsAction(
  input: PurchaseTicketsInput,
): Promise<ActionResponse<{ tickets_purchased: number }>> {
  try {
    // Validate input
    const validatedInput = PurchaseTicketsSchema.parse(input);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock user balance check (simulate insufficient funds 20% of the time)
    const hasInsufficientFunds = Math.random() < 0.2;

    if (hasInsufficientFunds) {
      return {
        success: false,
        error_message: "Insufficient balance to purchase tickets",
      };
    }

    return {
      success: true,
      data: {
        tickets_purchased: validatedInput.quantity,
      },
    };
  } catch (error) {
    return {
      success: false,
      error_message: "Failed to purchase tickets",
    };
  }
}
