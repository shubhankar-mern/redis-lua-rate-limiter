
### Redis-lua-rate-limiter

**Distributed, atomic, token-bucket rate limiter for Node.js powered by Redis Lua scripts.**

> Works correctly across multiple Node.js instances with zero race conditions by keeping the rate-limiting logic inside Redis.

---

##  The Problem With Typical Express Rate Limiters

Most middleware like `express-rate-limit`:

* Store counters in memory
* Break when you scale to multiple servers
* Leak requests under concurrency
* Suffer from race conditions

This library solves that by:

> Running the entire rate limiting algorithm **inside Redis** using **Lua**, executed atomically.

---

##  What is the Token Bucket Algorithm?

Token Bucket is an industry standard algorithm used by:

* API Gateways
* CDNs
* Reverse Proxies
* Cloud providers

### How it works

Each user / API key / IP has a **bucket**:

* Bucket has **capacity** (max tokens)
* Tokens **refill over time**
* Each request **consumes 1 token**
* If bucket is empty → request denied

This allows:

* Short bursts of traffic
* Strict control of long-term rate
* Smooth throttling instead of hard blocks

Example:

| Setting     | Value             |
| ----------- | ----------------- |
| Capacity    | 10                |
| Refill Rate | 5 tokens / second |

User can send 10 requests instantly, then 5 per second after.

---

##  Why Redis + Lua?

Without Lua:

```
GET tokens
CHECK tokens
SET tokens
```

This causes race conditions under concurrency.

With Lua:

```
All logic runs atomically inside Redis.
```

No race. No burst leak. Fully distributed.

---

##  Install

```bash
npm i redis-lua-rate-limiter
```

---

##  Basic Usage (IP based)

```ts
import express from "express";
import { createRateLimiter } from "redis-lua-rate-limiter";

const app = express();

const limiter = await createRateLimiter({
  redisUrl: "redis://localhost:6379",
  default: { capacity: 10, refillRate: 5 },
  headers: true,
});

app.use(limiter.middleware());

app.get("/", (_, res) => res.send("OK"));

app.listen(3000);
```

---

## 🔑 API Key Based Rate Limiting

```ts
const limiter = await createRateLimiter({
  redisUrl: "redis://localhost:6379",
  default: { capacity: 20, refillRate: 10 },

  keyGenerator: (req) => {
    const apiKey = req.headers["x-api-key"];
    if (typeof apiKey === "string") return `rate:${apiKey}`;
    return `rate:${req.ip}`;
  },
});
```

---

## 🛣️ Per Route Limits

```ts
const limiter = await createRateLimiter({
  redisUrl: "redis://localhost:6379",

  default: { capacity: 10, refillRate: 5 },

  routes: {
    "/login": { capacity: 3, refillRate: 1 },
    "/heavy": { capacity: 2, refillRate: 0.5 },
  },
});
```

---

## 📡 Rate Limit Headers

When `headers: true`:

```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 4
```

Similar to real API gateways.

---

##  Options Reference

```ts
createRateLimiter({
  redisUrl: string,              // required

  default: {
    capacity: number,
    refillRate: number
  },

  routes?: Record<string, {
    capacity: number,
    refillRate: number
  }>,

  keyGenerator?: (req: Request) => string,

  headers?: boolean
})
```

---

## 🧪 Benchmark (autocannon)

Tested under heavy concurrency:

```bash
npx autocannon -c 1000 -d 15 http://localhost:3000
```

Result:

```
160 2xx responses, 67579 non 2xx responses
69k requests in 15s
~4500 req/sec
```

This shows:

* Strict enforcement
* No race condition
* No burst leak
* Fully atomic behavior

---

##  Docker (for Redis)

```yaml
version: "3.9"
services:
  redis:
    image: redis:7
    ports:
      - "6379:6379"
```

Run:

```bash
docker compose up
```

---

##  Architecture

```
Client → Express → Redis Lua → Allow / Deny
```

All Node instances share the same Redis logic.

---

##  Features

* Token bucket algorithm
* Redis Lua atomic execution
* Works across multiple servers
* Per IP / API key / user limiting
* Per route limits
* Rate limit headers
* TypeScript support
* Production ready

---

##  When should you use this?

* Horizontally scaled Node.js apps
* Microservices
* API servers
* Authentication endpoints
* Public APIs

---

## 📜 License

MIT

---

