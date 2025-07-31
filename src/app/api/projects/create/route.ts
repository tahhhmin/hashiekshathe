import { NextRequest, NextResponse } from "next/server";
import Project from "@/models/Project";
import { connectDB } from "@/config/connectDB";

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

export async function POST(request: NextRequest) {
  try {
    await connectDB();

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

    // Validate volunteers if provided
    if (volunteers && Array.isArray(volunteers)) {
      for (const volunteer of volunteers) {
        if (!volunteer.user) {
          return NextResponse.json(
            { success: false, message: "Volunteer user ID is required." },
            { status: 400 }
          );
        }
      }
    }

    // Validate collaborators if provided
    if (collaborators && Array.isArray(collaborators)) {
      for (const collaborator of collaborators) {
        if (!collaborator.name) {
          return NextResponse.json(
            { success: false, message: "Collaborator name is required." },
            { status: 400 }
          );
        }
      }
    }

    // Validate sponsors if provided
    if (sponsors && Array.isArray(sponsors)) {
      for (const sponsor of sponsors) {
        if (!sponsor.name) {
          return NextResponse.json(
            { success: false, message: "Sponsor name is required." },
            { status: 400 }
          );
        }
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

    // Create the project
    const projectData = {
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

    const project = await Project.create(projectData);

    console.log(`[SERVER] Created new project: ${project.name} with ID: ${project._id}`);

    return NextResponse.json(
      { 
        success: true, 
        message: "Project created successfully.", 
        project: {
          id: project._id,
          name: project.name,
          slug: project.slug
        }
      },
      { status: 201 }
    );

  } catch (error: unknown) {
    console.error("Error in project creation handler:", error);

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

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const isPublic = searchParams.get('isPublic');

    const skip = (page - 1) * limit;

    // Build filter
    const filter: any = {};
    if (status) filter.status = status;
    if (isPublic !== null) filter.isPublic = isPublic === 'true';

    const projects = await Project.find(filter)
      .select('-__v')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('volunteers.user', 'name email');

    const total = await Project.countDocuments(filter);

    return NextResponse.json(
      {
        success: true,
        projects,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch projects." },
      { status: 500 }
    );
  }
}