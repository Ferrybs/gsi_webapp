// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

function createPrismaClient() {
  return new PrismaClient({
    log: [
      { level: "query", emit: "stdout" },
      { level: "warn", emit: "stdout" },
      { level: "error", emit: "stdout" },
      { level: "info", emit: "stdout" },
    ],
  });
}

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
