// src/app/api/projects/create/route.ts

import { NextRequest, NextResponse } from "next/server"
import Project from '@/models/Project'
import { connectDB } from "@/config/connectDB";

export async function POST(request: NextRequest) {
    try {
        await connectDB()

        const body = await request.json()
        const {
            name, location,
            startDate, endDate, description,
            tags,

            thumbnailURL, bannerURL, gallerySpreadsheetURL,
            financialRecordURL,

            impact, volunteers, collaborators, sponsors,
            status, isPublic,
        } = body

        // checking for input
        if (
            !name || !location.city || !location.division ||
            !startDate || !description || !tags || !status || !isPublic
        ) {
            return NextResponse.json(
                { success: false, message: "Name, location city, start date, description, tags, thumbnail URL, banner URL, gallery URLs, and financial record URL are required." },
                { status: 400 }
            )
        }
        // verify input
        if (name.length > 100) {
            return NextResponse.json(
                { success: false, message: "Project name cannot be more than 100 characters." },
                { status: 400 }
            )
        }
        if (description.length > 2000) {
            return NextResponse.json(
                { success: false, message: "Description cannot be more than 2000 characters." },
                { status: 400 }
            )
        }
        const start = new Date(startDate);
        const end = endDate ? new Date(endDate) : null;
    
        if (end && start >= end) {
            return NextResponse.json(
                { success: false, message: "End date must be after start date." },
                { status: 400 }
            )
        }

        // Validate volunteers if provided
        if (volunteers && Array.isArray(volunteers)) {
            for (const volunteer of volunteers) {
                if (!volunteer.volunteerEmail) {
                    return NextResponse.json(
                        { success: false, message: "Volunteer user ID is required." },
                        { status: 400 }
                    )
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
                    )
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
                    )
                }
            }
        }

        // Validate status
        const validStatuses = ['Upcoming', 'Ongoing', 'Completed'];
        if (status && !validStatuses.includes(status)) {
            return NextResponse.json(
                { success: false, message: "Status must be one of: Upcoming, Ongoing, Completed." },
                { status: 400 }
            )
        }

        const projectData = {
            name,
            location: {
                city: location.city,
                division: location.division,
            },
            startDate: new Date(startDate),
            endDate: endDate ? new Date(endDate) : undefined,
            description,
            tags: Array.isArray(tags) ? tags : [tags],
            thumbnailURL,
            bannerURL,
            gallerySpreadsheetURL,
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
        }

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
        )

        } 
    
    catch (error: unknown) {
        console.error("Error in project creation handler:", error);

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