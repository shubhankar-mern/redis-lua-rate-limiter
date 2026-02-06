import { Request, Response, NextFunction } from "express";

export function createExpressMiddleware(rateLimitFn: (key: string) => Promise<boolean>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = `rate:${req.ip}`;

    const allowed = await rateLimitFn(key);

    if (!allowed) {
      return res.status(429).json({ error: "Too Many Requests" });
    }

    next();
  };
}
