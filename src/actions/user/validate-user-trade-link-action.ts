"use server";
import { getCurrentUser } from "./get-current-user";
import { ActionResponse } from "@/types/action-response";

const BASE_ID = BigInt("76561197960265728");

const TRADE_LINK_REGEX =
  /^https:\/\/steamcommunity\.com\/tradeoffer\/new\/\?partner=(\d+)&token=([A-Za-z0-9_-]+)$/;

export async function validateTradeLinkAction(
  link: string,
): Promise<ActionResponse<boolean>> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error_message: "error.user_not_found" };

  const match = TRADE_LINK_REGEX.exec(link);
  if (!match)
    return { success: false, error_message: "error.invalid_trade_link" };

  const accountIdStr = match[1];

  const accountId = BigInt(accountIdStr);
  const steamId64 = (BASE_ID + accountId).toString();

  if (steamId64 !== user.steam_id)
    return { success: false, error_message: "error.invalid_trade_not_owner" };

  const res = await fetch(
    `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/` +
      `?key=${encodeURIComponent(process.env.STEAM_SECRET!)}` +
      `&steamids=${steamId64}`,
  );
  if (!res.ok)
    return { success: false, error_message: "error.trade_link_incorrect" };
  const body = await res.json();

  const valid =
    body?.response?.players &&
    Array.isArray(body.response.players) &&
    body.response.players.length === 1;
  return {
    success: valid,
    data: valid,
  };
}
