import { config } from "dotenv";

config({ path: `.env` });

export const {
    PORT,
    DATABASE_URI,
    DOMAIN,
    BETTER_AUTH_SECRET,
    BETTER_AUTH_URL,
} = process.env;