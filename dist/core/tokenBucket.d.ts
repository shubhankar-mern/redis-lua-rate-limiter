import { Redis } from "ioredis";
export declare function executeTokenBucket(redis: Redis, sha: string, key: string, capacity: number, refillRate: number): Promise<boolean>;
