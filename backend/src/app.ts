import express from "express";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const cors = require("cors");
import { PORT } from "./config/env.js";

const app = express();

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
