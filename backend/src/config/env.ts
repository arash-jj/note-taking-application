import { config } from "dotenv";

config({ path: `.env` });

export const {
    PORT,
    DATABASE_URI,
    DOMAIN,
    BETTER_AUTH_SECRET,
    BETTER_AUTH_URL,
} = process.env;
if (!BETTER_AUTH_SECRET) throw new Error("BETTER_AUTH_SECRET environment variable is not defined");
if (!DATABASE_URI) throw new Error("DATABASE_URI environment variable is not defined");