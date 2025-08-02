// app/api/projects/get/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/config/connectDB';
import Project from '@/models/Project';

export async function GET() {
    console.log('--- API Route /api/projects/get invoked ---');
    try {
        console.log('Attempting to connect to DB...');
        await connectDB();
        console.log('DB connected successfully.');

        console.log('Attempting to find public projects...');
        const projects = await Project.find({ isPublic: true }).sort({ createdAt: -1 });
        console.log('Found projects count:', projects.length);

        return NextResponse.json(projects, { status: 200 });
    } catch (error: unknown) { // Changed 'any' to 'unknown'
        console.error('API Route ERROR: Unhandled exception in /api/projects/get:', error);
        console.error('API Route ERROR Type:', typeof error);
        if (error instanceof Error) {
            console.error('API Route ERROR Message:', error.message);
            console.error('API Route ERROR Stack:', error.stack);
        } else {
            console.error('API Route ERROR - Not an Error instance:', error);
        }

        return NextResponse.json({
            message: 'Failed to fetch public projects',
            error: error instanceof Error ? error.message : 'An unknown server error occurred'
        }, { status: 500 });
    }
}
