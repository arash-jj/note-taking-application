import type { Request, Response } from "express";
import User from "../models/user.model.js";
import { BETTER_AUTH_SECRET } from "../config/env.js";
import * as bcrypt from "bcrypt";
import { signJWT } from "better-auth/crypto";

const SALT_ROUNDS = 10;

export const register = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "email and password are required" });
    try {
        const existing = await User.findOne({ email }).lean();
        if (existing) return res.status(409).json({ message: "email already in use" });
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        const user = await User.create({ email, passwordHash });
        return res.status(201).json({ id: user._id, email: user.email });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "internal server error" });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "email and password are required" });
    if (!BETTER_AUTH_SECRET) return res.status(500).json({ message: "server auth configuration missing" });
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "invalid credentials" });
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return res.status(401).json({ message: "invalid credentials" });
        const payload = {
            user: { id: String(user._id), email: user.email },
            session: { createdAt: Date.now() }
        };
        const token = await signJWT(payload, BETTER_AUTH_SECRET, 60 * 60 * 24 * 7);
        return res.json({ token, user: { id: String(user._id), email: user.email } });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "internal server error" });
    }
};

export const logout = async (_req: Request, res: Response) => {
    // stateless JWT — client should remove token/cookie. If you want server-side invalidation,
    // add a blacklist collection and store the jti or token until expiry.
    return res.json({ ok: true });
};

export default { register, login, logout };
