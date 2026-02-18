import type { Request, Response } from "express";
import { Note } from "../models/note.model.js";
import mongoose from "mongoose";

export const getTags = async (req: Request, res: Response) => {
    try {
        const tags = await Note.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(req.user.id) } },
            { $unwind: "$tags" },
            { $group: { _id: "$tags", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);
        res.json(tags);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch tags" });
    }
}