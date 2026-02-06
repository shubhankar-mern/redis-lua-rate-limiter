import { Request } from "express";
import { RateLimiterOptions } from "./types";
export declare function createRateLimiter(options: RateLimiterOptions): Promise<{
    middleware: () => (req: Request, res: any, next: any) => Promise<any>;
}>;
