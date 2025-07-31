// src/app/api/projects/get/route.ts (Alternative - without population)

import { NextResponse } from "next/server";
import Project from "@/models/Project";
import { connectDB } from "@/config/connectDB";

export async function GET() {
  try {
    console.log("[API] Starting to fetch projects...");
    
    // Connect to database
    await connectDB();
    console.log("[API] Database connected successfully");

    // Fetch projects without population first (to isolate the issue)
    const projects = await Project.find({}).lean();

    console.log(`[API] Successfully fetched ${projects.length} projects`);

    return NextResponse.json(
      { success: true, projects },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching all projects:", error);
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to fetch projects.",
        error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
      },
      { status: 500 }
    );
  }
}