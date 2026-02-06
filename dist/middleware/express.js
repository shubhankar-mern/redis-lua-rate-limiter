"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExpressMiddleware = createExpressMiddleware;
function createExpressMiddleware(rateLimitFn) {
    return async (req, res, next) => {
        const key = `rate:${req.ip}`;
        const allowed = await rateLimitFn(key);
        if (!allowed) {
            return res.status(429).json({ error: "Too Many Requests" });
        }
        next();
    };
}
//# sourceMappingURL=express.js.map