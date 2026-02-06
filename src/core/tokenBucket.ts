import { Redis } from "ioredis";

export async function executeTokenBucket(
  redis: Redis,
  sha: string,
  key: string,
  capacity: number,
  refillRate: number
) {
  const now = Math.floor(Date.now() / 1000);

  const allowed = await redis.evalsha(
    sha,
    1,
    key,
    capacity,
    refillRate,
    now,
    1
  );

  return allowed === 1;
}
