import { Router } from "express"
import { getTags } from "../controllers/tags.controller.js"
import { requireAuth } from "../middleware/auth.middleware.js"

const router = Router()

router.get("/", requireAuth, getTags)

export default router