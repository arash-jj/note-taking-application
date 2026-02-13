import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    email: string;
    passwordHash: string;
    createdAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        passwordHash: { type: String, required: true },
        createdAt: { type: Date, default: () => new Date() },
    },
    { timestamps: false }
);

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;