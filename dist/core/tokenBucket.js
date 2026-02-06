"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeTokenBucket = executeTokenBucket;
async function executeTokenBucket(redis, sha, key, capacity, refillRate) {
    const now = Math.floor(Date.now() / 1000);
    const allowed = await redis.evalsha(sha, 1, key, capacity, refillRate, now, 1);
    return allowed === 1;
}
//# sourceMappingURL=tokenBucket.js.map