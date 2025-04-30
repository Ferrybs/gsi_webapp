// src/app/api/streamers/live/route.ts

import { NextResponse } from "next/server";

export async function GET() {
  const mockStreamers = [
    {
      id: "1",
      name: "RNakano",
      twitchUsername: "RNakano",
      avatarUrl: `https://i.pravatar.cc/150?u=RNakano`,
      thumbnailUrl: `https://placehold.co/640x360?text=RNakano`,
      viewers: 1882,
      isLive: true,
      odds: 2.25,
    },
    {
      id: "2",
      name: "Liminha",
      twitchUsername: "liminhag0d",
      avatarUrl: `https://i.pravatar.cc/150?u=liminhag0d`,
      thumbnailUrl: `https://placehold.co/640x360?text=liminhag0d`,
      viewers: 1618,
      isLive: true,
      odds: 1.87,
    },
    {
      id: "3",
      name: "wastzera",
      twitchUsername: "wastzera",
      avatarUrl: `https://i.pravatar.cc/150?u=wastzera`,
      thumbnailUrl: `https://placehold.co/640x360?text=wastzera`,
      viewers: 953,
      isLive: true,
      odds: 3.12,
    },
    {
      id: "4",
      name: "LUCAS1",
      twitchUsername: "lucas1",
      avatarUrl: `https://i.pravatar.cc/150?u=lucas1`,
      thumbnailUrl: `https://placehold.co/640x360?text=lucas1`,
      viewers: 201,
      isLive: true,
      odds: 2.8,
    },
  ];

  return NextResponse.json(mockStreamers);
}
