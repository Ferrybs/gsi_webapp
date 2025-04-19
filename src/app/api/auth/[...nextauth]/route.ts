// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import Steam from "next-auth-steam";
import type { NextRequest } from "next/server";
import { sign } from "jsonwebtoken";
import type { JWT } from "next-auth/jwt";

async function auth(
  req: NextRequest,
  ctx: {
    params: {
      nextauth: string[];
    };
  },
) {
  return NextAuth(req, ctx, {
    providers: [
      Steam(req, {
        clientSecret: process.env.STEAM_SECRET!,
      }),
    ],
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.sub = user.id;
          (token as JWT & { steamToken: string }).steamToken = sign(
            {
              id: user.id,
              name: user.name,
              avatar: user.image,
            },
            process.env.NEXTAUTH_SECRET!,
            { expiresIn: "7d" },
          );
        }
        return token;
      },
      async session({ session, token }) {
        return {
          ...session,
          user: {
            ...session.user,
            id: token.sub as string,
            token: (token as JWT & { steamToken: string }).steamToken,
          },
        };
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
  });
}

export { auth as GET, auth as POST };
