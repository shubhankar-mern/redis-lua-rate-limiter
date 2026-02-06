local key = KEYS[1]

local capacity = tonumber(ARGV[1])
local refill_rate = tonumber(ARGV[2])
local now = tonumber(ARGV[3])
local requested = tonumber(ARGV[4])

local data = redis.call("HMGET", key, "tokens", "timestamp")
local tokens = tonumber(data[1])
local timestamp = tonumber(data[2])

if tokens == nil then
    tokens = capacity
    timestamp = now
end

local delta = math.max(0, now - timestamp)
local refill = delta * refill_rate
tokens = math.min(capacity, tokens + refill)

local allowed = tokens >= requested

if allowed then
    tokens = tokens - requested
end

redis.call("HMSET", key, "tokens", tokens, "timestamp", now)
redis.call("EXPIRE", key, 3600)

return { allowed and 1 or 0, tokens }
