// app/api/projects/[slug]/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/config/connectDB';
import Project from '@/models/Project';

export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
) {
    const { slug } = params;
    console.log(`--- API Route /api/projects/${slug} invoked ---`); // Debug Log

    if (!slug) {
        console.log('API Route: Slug is missing.'); // Debug Log
        return NextResponse.json({ message: 'Project slug is required' }, { status: 400 });
    }

    try {
        console.log('API Route: Attempting to connect to DB...'); // Debug Log
        await connectDB(); // This is the most common point of failure
        console.log('API Route: DB connected successfully.'); // Debug Log

        console.log(`API Route: Searching for project with slug: "${slug}"`); // Debug Log
        // Fetch the project and specifically select the 'volunteers' field so it's included
        const project = await Project.findOne({ slug: slug, isPublic: true }).select('+volunteers'); // Ensure volunteers are fetched
        console.log(`API Route: Project found: ${!!project}`); // Debug Log

        if (!project) {
            console.log(`API Route: Project with slug "${slug}" not found or not public.`); // Debug Log
            return NextResponse.json({ message: 'Project not found or not public' }, { status: 404 });
        }

        console.log(`API Route: Successfully fetched project: ${project.name}`); // Debug Log
        return NextResponse.json(project, { status: 200 });
    } catch (error: any) {
        // Log the full error object to understand why it's null on the client
        console.error(`API Route ERROR: Unhandled exception fetching project "${slug}":`, error);
        console.error('Error type:', typeof error);
        if (error instanceof Error) {
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
        }

        return NextResponse.json({
            message: `Failed to fetch project with slug "${slug}"`,
            error: error instanceof Error ? error.message : 'An unknown server error occurred'
        }, { status: 500 });
    }
}