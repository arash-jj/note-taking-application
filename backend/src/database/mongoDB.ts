import mongoose from "mongoose";
import { DATABASE_URI } from "../config/env.js";

if (!DATABASE_URI) throw new Error("check the db connection");

const connectTODatabase = async () => {
    try {
        await mongoose.connect( DATABASE_URI! )
        console.log(`Connected to DB successfully`);
        
    } catch (error) {
        console.error('something went wrong');
        process.exit(1)
    }
}

export default connectTODatabase