"use server";
import { getServerSteamUser } from "@/lib/session";
import jwt from "jsonwebtoken";

export async function getWsTokenAction() {
  const secret = process.env.WS_SECRET!;

  const token = jwt.sign(
    {},
    secret,
    { expiresIn: "1d" },
  );
  return token;
}