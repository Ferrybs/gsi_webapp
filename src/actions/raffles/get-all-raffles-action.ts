"use server";

import { prisma } from "@/lib/prisma";
import { Raffle, RaffleSchema } from "@/schemas/raffle.schema";
import { Skin, SkinSchema } from "@/schemas/skin.schema";
import { Users, UsersSchema } from "@/schemas/users.schema";
import type { ActionResponse } from "@/types/action-response";
import { raffle_status } from "@prisma/client";

export type RaffleWithSkin = Raffle & {
  skin: Skin;
  winner: Users | null;
};

export async function getAllRafflesAction(): Promise<
  ActionResponse<RaffleWithSkin[]>
> {
  try {
    const response = await prisma.raffles.findMany({
      where: {
        status: {
          not: raffle_status.cancelled,
        },
      },
      include: {
        skins: true,
        users: true,
      },
    });
    const raffles: RaffleWithSkin[] = response.map((raffle) => ({
      ...RaffleSchema.parse(raffle),
      skin: SkinSchema.parse({
        ...raffle.skins,
        fiat_value: raffle.skins.estimated_fiat_value.mul(
          raffle.skins.fee_pct.add(1)
        ),
      }),
      winner: raffle.users ? UsersSchema.parse(raffle.users) : null,
    }));

    return {
      success: true,
      data: raffles,
    };
  } catch (error) {
    console.error("Error fetching raffles:", error);
    return {
      success: false,
      error_message: "error.internal_error",
    };
  }
}
