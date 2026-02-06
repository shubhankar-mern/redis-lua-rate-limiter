import { Request, Response, NextFunction } from "express";
export declare function createExpressMiddleware(rateLimitFn: (key: string) => Promise<boolean>): (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
