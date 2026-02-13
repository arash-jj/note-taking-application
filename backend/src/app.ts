import express from "express";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const cors = require("cors");
import { DOMAIN, PORT } from "./config/env.js";
import requireAuth from "./middleware/auth.middleware.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(
    cors({
        origin: `${DOMAIN || "http://localhost:5173/"}`,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], 
        credentials: true,
    })
);
app.use(express.json());


app.use("/api/auth", authRoutes);

app.get("/api/me", requireAuth, (req, res) => {
    return res.json({ user: req.user || null });
});

app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    await import("./database/mongoDB.js").then(({ default: connectToDatabase }) => connectToDatabase());
});
