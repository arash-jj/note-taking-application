import type { Request, Response, NextFunction } from "express";
import { BETTER_AUTH_SECRET } from "../config/env.js";
import { getCookieCache } from "better-auth/cookies";
import { verifyJWT } from "better-auth/crypto";

declare global {
    namespace Express {
        interface Request {
            user?: any;
            session?: any;
        }
    }
}

async function extractAuthFromCookie(req: Request) {
    try {
        const payload = await getCookieCache(req.headers, { secret: BETTER_AUTH_SECRET });
        if (payload && payload.user) return { user: payload.user, session: payload.session };
    } catch (err) {
    }
    return null;
}

async function extractAuthFromAuthorizationHeader(req: Request) {
    const auth = req.headers["authorization"] || req.headers["Authorization"];
    if (!auth || typeof auth !== "string") return null;
    const parts = auth.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") return null;
    const token = parts[1];
    if (BETTER_AUTH_SECRET) {
        const payload = await verifyJWT(token!, BETTER_AUTH_SECRET);
        if (payload && (payload as any).user) return { user: (payload as any).user, session: (payload as any).session };
    }
    return null;
}

async function extractAuth(req: Request) {
    const fromCookie = await extractAuthFromCookie(req);
    if (fromCookie) return fromCookie;
    const fromHeader = await extractAuthFromAuthorizationHeader(req);
    if (fromHeader) return fromHeader;
    return null;
}

export async function optionalAuth(req: Request, _res: Response, next: NextFunction) {
    const auth = await extractAuth(req);
    if (auth) {
        req.user = auth.user;
        req.session = auth.session;
    }
    return next();
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
    const auth = await extractAuth(req);
    if (!auth) return res.status(401).json({ message: "Unauthorized" });
    req.user = auth.user;
    req.session = auth.session;
    return next();
}

export default requireAuth;
