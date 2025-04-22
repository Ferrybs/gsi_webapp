import { sign } from "jsonwebtoken";
import { NextApiRequest } from "next";
import { NextAuthOptions } from "next-auth";
import Steam from "next-auth-steam";
import { JWT } from "next-auth/jwt";
import { NextRequest } from "next/server";

export function authOptions(
  req: Request | NextRequest | NextApiRequest,
): NextAuthOptions {
  return {
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
            avatar: session.user?.image,
          },
        };
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
  };
}
