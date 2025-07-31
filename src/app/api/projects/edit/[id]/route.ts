// src/app/api/projects/edit/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import Project from "@/models/Project";
import { connectDB } from "@/config/connectDB";
import mongoose from "mongoose";

// Dynamically import User model to avoid potential circular dependencies
let UserModel: any = null;
try {
  UserModel = require("@/models/User").default;
} catch (error) {
  console.warn("User model not found or has issues, proceeding without population");
}

/**
 * Custom type guard for Mongoose validation error.
 */
function isMongooseValidationError(
  error: unknown
): error is Error & { errors: Record<string, { message: string }> } {
  if (!(error instanceof Error) || error.name !== "ValidationError") {
    return false;
  }

  const potentialErrorWithErrors = error as { errors?: unknown };
  return (
    "errors" in potentialErrorWithErrors &&
    typeof potentialErrorWithErrors.errors === "object" &&
    potentialErrorWithErrors.errors !== null
  );
}

// GET single project by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params; // Await params before accessing properties

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid project ID." },
        { status: 400 }
      );
    }

    // Try to populate volunteers.user if User model is available, otherwise fetch without population
    let project;
    try {
      if (UserModel) {
        project = await Project.findById(id).populate('volunteers.user', 'name email');
      } else {
        project = await Project.findById(id);
      }
    } catch (populateError) {
      console.warn("Population failed, fetching project without user details:", populateError);
      project = await Project.findById(id);
    }

    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, project },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch project." },
      { status: 500 }
    );
  }
}

// PUT update project by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params; // Await params before accessing properties

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid project ID." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      name,
      location,
      startDate,
      endDate,
      description,
      tags,
      thumbnailURL,
      bannerURL,
      galleryURL,
      financialRecordURL,
      impact,
      volunteers,
      collaborators,
      sponsors,
      status,
      isPublic
    } = body;

    // Validate required fields
    if (!name || !location?.city || !startDate || !description || !tags || !thumbnailURL || !bannerURL || !galleryURL || !financialRecordURL) {
      return NextResponse.json(
        { success: false, message: "Name, location city, start date, description, tags, thumbnail URL, banner URL, gallery URLs, and financial record URL are required." },
        { status: 400 }
      );
    }

    // Validate name length
    if (name.length > 100) {
      return NextResponse.json(
        { success: false, message: "Project name cannot be more than 100 characters." },
        { status: 400 }
      );
    }

    // Validate description length
    if (description.length > 2000) {
      return NextResponse.json(
        { success: false, message: "Description cannot be more than 2000 characters." },
        { status: 400 }
      );
    }

    // Validate tags
    if (!Array.isArray(tags) || tags.length === 0) {
      return NextResponse.json(
        { success: false, message: "At least one tag is required." },
        { status: 400 }
      );
    }

    // Validate gallery URLs
    if (!Array.isArray(galleryURL) || galleryURL.length === 0) {
      return NextResponse.json(
        { success: false, message: "At least one gallery image is required." },
        { status: 400 }
      );
    }

    // Validate date range
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;
    
    if (end && start >= end) {
      return NextResponse.json(
        { success: false, message: "End date must be after start date." },
        { status: 400 }
      );
    }

    // Validate URLs (basic check)
    const urlRegex = /^https?:\/\/.+/;
    const urlFields = [thumbnailURL, bannerURL, financialRecordURL, ...galleryURL];
    
    for (const url of urlFields) {
      if (!urlRegex.test(url)) {
        return NextResponse.json(
          { success: false, message: "All URLs must be valid HTTP/HTTPS URLs." },
          { status: 400 }
        );
      }
    }

    // Validate status
    const validStatuses = ['Upcoming', 'Ongoing', 'Completed'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Status must be one of: Upcoming, Ongoing, Completed." },
        { status: 400 }
      );
    }

    // Update the project
    const updateData = {
      name,
      location: {
        city: location.city,
        division: location.division || undefined,
        country: location.country || "Bangladesh"
      },
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : undefined,
      description,
      tags: Array.isArray(tags) ? tags : [tags],
      thumbnailURL,
      bannerURL,
      galleryURL: Array.isArray(galleryURL) ? galleryURL : [galleryURL],
      financialRecordURL,
      impact: {
        peopleServed: impact?.peopleServed || 0,
        volunteersEngaged: impact?.volunteersEngaged || 0,
        materialsDistributed: impact?.materialsDistributed || 0
      },
      volunteers: volunteers || [],
      collaborators: collaborators || [],
      sponsors: sponsors || [],
      status: status || 'Upcoming',
      isPublic: isPublic !== undefined ? isPublic : true
    };

    // Try to populate volunteers.user if User model is available, otherwise update without population
    let project;
    try {
      if (UserModel) {
        project = await Project.findByIdAndUpdate(
          id,
          updateData,
          { new: true, runValidators: true }
        ).populate('volunteers.user', 'name email');
      } else {
        project = await Project.findByIdAndUpdate(
          id,
          updateData,
          { new: true, runValidators: true }
        );
      }
    } catch (populateError) {
      console.warn("Population failed during update, proceeding without user details:", populateError);
      project = await Project.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
    }

    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project not found." },
        { status: 404 }
      );
    }

    console.log(`[SERVER] Updated project: ${project.name} with ID: ${project._id}`);

    return NextResponse.json(
      { 
        success: true, 
        message: "Project updated successfully.", 
        project
      },
      { status: 200 }
    );

  } catch (error: unknown) {
    console.error("Error updating project:", error);

    if (isMongooseValidationError(error)) {
      const messages = Object.values(error.errors).map((e) => e.message);
      return NextResponse.json(
        { success: false, message: "Validation error: " + messages.join(", ") },
        { status: 400 }
      );
    }

    // Handle duplicate key error (slug uniqueness)
    if (error instanceof Error && 'code' in error && error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "A project with this name already exists. Please choose a different name." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}

// DELETE project by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params; // Await params before accessing properties

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid project ID." },
        { status: 400 }
      );
    }

    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project not found." },
        { status: 404 }
      );
    }

    console.log(`[SERVER] Deleted project: ${project.name} with ID: ${project._id}`);

    return NextResponse.json(
      { success: true, message: "Project deleted successfully." },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete project." },
      { status: 500 }
    );
  }
}