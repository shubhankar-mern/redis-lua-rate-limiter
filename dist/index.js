"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRateLimiter = createRateLimiter;
const redis_1 = require("./core/redis");
const lua_1 = require("./core/lua");
async function createRateLimiter(options) {
    const redis = (0, redis_1.createRedisClient)(options.redisUrl);
    const sha = await (0, lua_1.loadLua)(redis);
    const keyGen = options.keyGenerator || ((req) => `rate:${req.ip}`);
    const routes = new Map(Object.entries(options.routes || {}));
    async function rateLimit(key, config) {
        const now = Math.floor(Date.now() / 1000);
        const [allowed, remaining] = (await redis.evalsha(sha, 1, key, config.capacity, config.refillRate, now, 1));
        return { allowed: allowed === 1, remaining };
    }
    function middleware() {
        return async (req, res, next) => {
            const routeConfig = routes.get(req.path) || options.default;
            const key = keyGen(req);
            const { allowed, remaining } = await rateLimit(key, routeConfig);
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
//# sourceMappingURL=index.js.map