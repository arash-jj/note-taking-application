import { Note } from "../models/note.model.js"
import mongoose from "mongoose"

const isValidId = (id: string) => mongoose.Types.ObjectId.isValid(id)

export const getNotes = async (req: any, res: any) => {
    if (!req.user) {
        return res.status(401).json({
            message: "Unauthorized: No user found in request",
        })
    }
    const notes = await Note.find({
        userId: req.user.id,
        isArchived: false,
    }).sort({ updatedAt: -1 })
    res.json(notes)
}

export const createNote = async (req: any, res: any) => {
    const { title, content, tags } = req.body
    if (!title || title.trim() === "") return res.status(400).json({ message: "Title is required" })
    const newNote = new Note({
        userId: req.user.id,
        title,
        content: content || "",
        tags: tags || [],
    })
    try {
        const savedNote = await newNote.save()
        res.status(201).json(savedNote)
    } catch (error) {
        console.error("Error creating note:", error)
        res.status(500).json({ message: "Failed to create note" })
    }
}

export const getNoteById = async (req: any, res: any) => {
    if (!isValidId(req.params.id)) {
        return res.status(400).json({ message: "Invalid note ID" })
    }
    const note = await Note.findOne({
        _id: req.params.id,
        userId: req.user.id,
    })
    if (!note) {
        return res.status(404).json({ message: "Note not found" })
    }
    res.json(note)
}

export const updateNote = async (req: any, res: any) => {
    const { title, content, tags } = req.body
    const note = await Note.findOne({
        _id: req.params.id,
        userId: req.user.id,
    })
    if (!note) {
        return res.status(404).json({ message: "Note not found" })
    }
    // Update only fields that exist
    if (title !== undefined) note.title = title
    if (content !== undefined) note.content = content
    if (tags !== undefined) note.tags = tags
    await note.save()
    res.json(note)
}

export const deleteNote = async (req: any, res: any) => {
    const note = await Note.findOneAndDelete({
        _id: req.params.id,
        userId: req.user.id,
    })
    if (!note) {
        return res.status(404).json({ message: "Note not found" })
    }
    res.json({ message: "Note deleted successfully" })
}

export const archiveNote = async (req: any, res: any) => {
    const note = await Note.findOne({
        _id: req.params.id,
        userId: req.user.id,
    })
    if (!note) {
        return res.status(404).json({ message: "Note not found" })
    }
    note.isArchived = true
    await note.save()
    res.json({ message: "Note archived", note })
}
