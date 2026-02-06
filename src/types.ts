import { Request } from "express";

export type BucketConfig = {
  capacity: number;
  refillRate: number;
};

export type RateLimiterOptions = {
  redisUrl: string;
  default: BucketConfig;
  routes?: Record<string, BucketConfig>;
  keyGenerator?: (req: Request) => string;
  headers?: boolean;
};
