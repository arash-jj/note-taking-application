import { Router } from "express"
import {
    createNote,
    getNotes,
    getNoteById,
    updateNote,
    deleteNote,
    archiveNote,
} from "../controllers/note.controller.js"
import { requireAuth } from "../middleware/auth.middleware.js"


const router = Router()

router.get("/", requireAuth, getNotes)
router.post("/", requireAuth, createNote)

router.get("/:id", requireAuth, getNoteById)
router.patch("/:id", requireAuth, updateNote)
router.delete("/:id", requireAuth, deleteNote)

router.patch("/:id/archive", requireAuth, archiveNote)

export default router
