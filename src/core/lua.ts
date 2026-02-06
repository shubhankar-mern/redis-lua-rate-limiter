import fs from "fs";
import path from "path";
import { Redis } from "ioredis";

export async function loadLua(redis: Redis) {
  const luaPath = path.join(__dirname, "..", "..", "lua", "token_bucket.lua");
  const script = fs.readFileSync(luaPath, "utf8");
  const sha = await redis.script("LOAD", script);
  return sha;
}

