// src/config/connectDB.ts

import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
    if (isConnected) return;
    try {
        await mongoose.connect(process.env.MONGO_URI!, {
        maxPoolSize: 10, 
        serverSelectionTimeoutMS: 5000, 
        socketTimeoutMS: 45000,
        });

        isConnected = true;
        console.log("MongoDB connected");
    } catch (error) {
        console.error("Database connection error:", error);
        process.exit(1);
    }
}