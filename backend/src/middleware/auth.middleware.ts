import type { Request, Response, NextFunction } from "express";
import { BETTER_AUTH_SECRET } from "../config/env.js";
import { verifyJWT } from "better-auth/crypto";

declare global {
    namespace Express {
        interface Request {
            user: any;
            session?: any;
        }
    }
}

async function extractAuthFromAuthorizationHeader(req: Request) {
    const auth = req.headers["authorization"] || req.headers["Authorization"];
    
    if (!auth || typeof auth !== "string") return null;
    
    const parts = auth.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") return null;
    
    const token = parts[1];
    if (!token) return null;
    
    if (!BETTER_AUTH_SECRET) {
        console.error("BETTER_AUTH_SECRET is not set");
        return null;
    }
    
    try {
        const payload = await verifyJWT(token, BETTER_AUTH_SECRET);
        
        if (!payload) return null;
        
        let userData = null;
        let sessionData = null;
        
        if ((payload as any).user) {
            userData = (payload as any).user;
            sessionData = (payload as any).session;
        } else {
            userData = payload;
        }
        
        if (!userData) return null;
        
        if (!userData.id && userData._id) {
            userData.id = userData._id;
        }
        
        if (!userData.id && userData.userId) {
            userData.id = userData.userId;
        }
        
        if (!userData.id && (payload as any).sub) {
            userData.id = (payload as any).sub;
        }
        
        if (!userData.id) {
            console.error("No ID found in user data. Available keys:", Object.keys(userData));
            return null;
        }
        
        return {
            user: userData,
            session: sessionData
        };
        
    } catch (error) {
        console.error("JWT verification failed:", error);
        return null;
    }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
    try {
        const auth = await extractAuthFromAuthorizationHeader(req);
        
        if (!auth) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        
        if (!auth.user || !auth.user.id) {
            console.error("User missing ID:", auth.user);
            return res.status(401).json({ message: "Unauthorized" });
        }
        
        req.user = auth.user;
        req.session = auth.session;
        
        next();
        
    } catch (error) {
        console.error("Auth error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function optionalAuth(req: Request, res: Response, next: NextFunction) {
    try {
        const auth = await extractAuthFromAuthorizationHeader(req);
        
        if (auth) {
            req.user = auth.user;
            req.session = auth.session;
        }
        
        next();
        
    } catch (error) {
        console.error("Optional auth error:", error);
        next();
    }
}

export default requireAuth;