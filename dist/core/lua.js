"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadLua = loadLua;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
async function loadLua(redis) {
    const luaPath = path_1.default.join(__dirname, "..", "..", "lua", "token_bucket.lua");
    const script = fs_1.default.readFileSync(luaPath, "utf8");
    const sha = await redis.script("LOAD", script);
    return sha;
}
//# sourceMappingURL=lua.js.map