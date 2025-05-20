import Redis from "ioredis";

declare global {
  var redisG: Redis | undefined;
}

export const redis = globalThis.redisG ?? new Redis(process.env.REDIS_URL!);

if (process.env.NODE_ENV !== "production") {
  globalThis.redisG = redis;
}
