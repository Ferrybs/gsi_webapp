// src/app/api/issue-token/route.ts
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getSteamUser } from "@/lib/session";

export async function POST(req: Request) {
  const user = await getSteamUser(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { redirect } = await req.json();

  if (!redirect) {
    return NextResponse.json(
      { error: "Missing redirect param" },
      { status: 400 },
    );
  }

  const secret = process.env.CALLBACK_SECRET!;
  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      roles: ["User", "EventAdmin"],
    },
    secret,
    { expiresIn: "7d" },
  );

  return NextResponse.json({ token });
}
