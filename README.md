# redis-lua-rate-limiter

Distributed, atomic, token-bucket rate limiter for Node.js powered by Redis Lua scripts.

## Why?

Most Express rate limiters break in distributed systems.
This one keeps the logic inside Redis using Lua for atomic safety.

## Install

```bash
npm i redis-lua-rate-limiter
```

## Usage

```ts
import express from "express";
import { createRateLimiter } from "redis-lua-rate-limiter";

const limiter = await createRateLimiter({
  redisUrl: "redis://localhost:6379",
  default: { capacity: 10, refillRate: 5 },
  headers: true,
});

app.use(limiter.middleware());
```

## Features

- Token bucket algorithm
- Redis Lua atomic execution
- Per API key / IP limiting
- Per route limits
- Rate limit headers
- Works across multiple Node servers

## Benchmark

```
$ npx autocannon -c 1000 -d 15 http://localhost:3000
Running 15s test @ http://localhost:3000
```

Tested with 1000 connections using autocannon

```
┌─────────┬────────┬────────┬────────┬────────┬───────────┬──────────┬────────┐
│ Stat    │ 2.5%   │ 50%    │ 97.5%  │ 99%    │ Avg       │ Stdev
    │ Max    │
├─────────┼────────┼────────┼────────┼────────┼───────────┼──────────┼────────┤
│ Latency │ 203 ms │ 214 ms │ 253 ms │ 481 ms │ 220.74 ms │ 41.38 ms │ 759 ms │
└─────────┴────────┴────────┴────────┴────────┴───────────┴──────────┴────────┘
┌───────────┬────────┬────────┬─────────┬─────────┬─────────┬────────┬────────┐
│ Stat      │ 1%     │ 2.5%   │ 50%     │ 97.5%   │ Avg     │ Stdev  │ Min    │
├───────────┼────────┼────────┼─────────┼─────────┼─────────┼────────┼────────┤
│ Req/Sec   │ 2,739  │ 2,739  │ 4,595   │ 5,003   │ 4,516.4 │ 558.22 │ 2,739  │
├───────────┼────────┼────────┼─────────┼─────────┼─────────┼────────┼────────┤
│ Bytes/Sec │ 898 kB │ 898 kB │ 1.51 MB │ 1.64 MB │ 1.48 MB │ 183 kB │ 897 kB │
└───────────┴────────┴────────┴─────────┴─────────┴─────────┴────────┴────────┘
```
Req/Bytes counts sampled once per second.
# of samples: 15
```
160 2xx responses, 67579 non 2xx responses
69k requests in 15.22s, 22.2 MB read

```

Shows strict enforcement without race conditions.

## Docker

```bash
docker compose up
```
