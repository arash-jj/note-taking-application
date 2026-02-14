import mongoose, { Document, Schema } from 'mongoose';

export interface INote extends Document {
    userId: mongoose.Types.ObjectId
    title: string
    content: string
    tags: string[]
    isArchived: boolean
    createdAt: Date
    updatedAt: Date
}

const NoteSchema = new Schema<INote>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 120,
        },
        content: {
            type: String,
            default: "",
        },
        tags: {
            type: [String],
            default: [],
        },
        isArchived: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
)

export const Note = mongoose.model<INote>("Note", NoteSchema)