// src/config/connectDB.ts (Improved version)

import mongoose from "mongoose";

// Track connection state more reliably
const connection: { isConnected?: number } = {};

export async function connectDB() {
  // If already connected, return early
  if (connection.isConnected) {
    console.log("Already connected to MongoDB");
    return;
  }

  // Check if MongoDB URI exists
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI environment variable is not defined");
  }

  try {
    console.log("Attempting to connect to MongoDB...");
    
    const db = await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
    });

    connection.isConnected = db.connections[0].readyState;
    console.log("MongoDB connected successfully");

  } catch (error) {
    console.error("Database connection error:", error);
    
    // In development, don't exit the process
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    } else {
      throw error; // Re-throw for API routes to handle
    }
  }
}

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
  connection.isConnected = 0;
});