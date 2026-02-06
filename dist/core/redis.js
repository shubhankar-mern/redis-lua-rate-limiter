"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRedisClient = createRedisClient;
const ioredis_1 = __importDefault(require("ioredis"));
function createRedisClient(redisUrl) {
    return new ioredis_1.default(redisUrl);
}
//# sourceMappingURL=redis.js.map