"use server";

import { Raffle } from "@/schemas/raffle.schema";
import { Skin } from "@/schemas/skin.schema";
import type { ActionResponse } from "@/types/action-response";
import { currency, exterior } from "@prisma/client";

export type RaffleWithSkin = Raffle & {
  skin: Skin;
  winner_username?: string;
};

export async function getAllRafflesAction(): Promise<
  ActionResponse<RaffleWithSkin[]>
> {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock skins data
    const mockSkins: Skin[] = [
      {
        id: 1,
        market_hash_name: "AK-47 | Redline (Field-Tested)",
        type: "Rifle",
        image_url:
          "https://community.fastly.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf2ObDYzR9_8yJmYWYn8jgMrXummJW4NE_j-2Xpdyl3Qbl_kc_YGGlIYOWcwI8aVnV_ATslOvmjJ677sicmHJqsz5iuyg6yWV5Bw",
        tradable: true,
        exterior: exterior.FieldTested,
        currency: currency.USD,
        fiat_value: 45.5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 2,
        market_hash_name: "AWP | Dragon Lore (Minimal Wear)",
        type: "Sniper Rifle",
        image_url:
          "https://community.fastly.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf2ObDYzR9_8yJmYWYn8jgMrXummJW4NE_j-2Xpdyl3Qbl_kc_YGGlIYOWcwI8aVnV_ATslOvmjJ677sicmHJqsz5iuyg6yWV5Bw",
        tradable: true,
        exterior: exterior.MinimalWear,
        currency: currency.USD,
        fiat_value: 2850.0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 3,
        market_hash_name: "Karambit | Fade (Factory New)",
        type: "Knife",
        image_url:
          "https://community.fastly.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf2ObDYzR9_8yJmYWYn8jgMrXummJW4NE_j-2Xpdyl3Qbl_kc_YGGlIYOWcwI8aVnV_ATslOvmjJ677sicmHJqsz5iuyg6yWV5Bw",
        tradable: true,
        exterior: exterior.FactoryNew,
        currency: currency.USD,
        fiat_value: 1250.0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    // Mock raffles data
    const mockRaffles: RaffleWithSkin[] = [
      {
        id: "550e8400-e29b-41d4-a716-446655440001",
        skin_id: 1,
        ticket_price: "100",
        status: "active",
        winner_user_id: null,
        drawn_at: null,
        end_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        skin: mockSkins[0],
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440002",
        skin_id: 2,
        ticket_price: "500",
        status: "active",
        winner_user_id: null,
        drawn_at: null,
        end_at: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(), // 5 hours from now
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        skin: mockSkins[1],
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440003",
        skin_id: 3,
        ticket_price: "250",
        status: "closed",
        winner_user_id: null,
        drawn_at: null,
        end_at: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(), // 1 hour from now
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        skin: mockSkins[2],
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440004",
        skin_id: 1,
        ticket_price: "100",
        status: "closed",
        winner_user_id: "550e8400-e29b-41d4-a716-446655440010",
        drawn_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
        end_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        skin: mockSkins[0],
        winner_username: "ProGamer123",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440005",
        skin_id: 2,
        ticket_price: "500",
        status: "closed",
        winner_user_id: "550e8400-e29b-41d4-a716-446655440011",
        drawn_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
        end_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        skin: mockSkins[1],
        winner_username: "SniperKing",
      },
    ];

    return {
      success: true,
      data: mockRaffles,
    };
  } catch (error) {
    return {
      success: false,
      error_message: "Failed to fetch raffles",
    };
  }
}
