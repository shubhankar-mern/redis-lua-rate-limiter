import express from "express";
import { createRateLimiter } from "../src";

async function main() {
  const limiter = await createRateLimiter({
    redisUrl: "redis://localhost:6379",

    default: { capacity: 10, refillRate: 5 },

    routes: {
      "/login": { capacity: 3, refillRate: 1 },
    },

    keyGenerator: (req) => {
  const apiKey = req.headers["x-api-key"];

  if (typeof apiKey === "string") {
    return `rate:${apiKey}`;
    }

    return `rate:${req.ip}`;
    },

    headers: true,
  });

  const app = express();
  app.use(limiter.middleware());

  app.get("/", (_, res) => res.send("OK"));
  app.get("/login", (_, res) => res.send("Login"));

  app.listen(3000, () => console.log("Running"));
}

main();
