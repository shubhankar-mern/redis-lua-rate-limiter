import { createRedisClient } from "./core/redis";
import { loadLua } from "./core/lua";
import { Request } from "express";
import { RateLimiterOptions, BucketConfig } from "./types";

export async function createRateLimiter(options: RateLimiterOptions) {
  const redis = createRedisClient(options.redisUrl);
  const sha = await loadLua(redis);

  const keyGen =
    options.keyGenerator || ((req: Request) => `rate:${req.ip}`);

  const routes = new Map<string, BucketConfig>(
    Object.entries(options.routes || {})
  );

  async function rateLimit(
    key: string,
    config: BucketConfig
  ): Promise<{ allowed: boolean; remaining: number }> {
    const now = Math.floor(Date.now() / 1000);

    const [allowed, remaining] = (await redis.evalsha(
      sha as string,
      1,
      key,
      config.capacity,
      config.refillRate,
      now,
      1
    )) as [number, number];

    return { allowed: allowed === 1, remaining };
  }

  function middleware() {
    return async (req: Request, res: any, next: any) => {
      const routeConfig =
        routes.get(req.path) || options.default;

      const key = keyGen(req);

      const { allowed, remaining } = await rateLimit(
        key,
        routeConfig
      );

      if (options.headers) {
        res.setHeader("X-RateLimit-Limit", routeConfig.capacity);
        res.setHeader("X-RateLimit-Remaining", Math.floor(remaining));
      }

      if (!allowed) {
        return res.status(429).json({
          error: "Too Many Requests",
        });
      }

      next();
    };
  }

  return { middleware };
}
