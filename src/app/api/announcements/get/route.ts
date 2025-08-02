import { NextResponse } from 'next/server';
import { connectDB } from '@/config/connectDB';
import Announcement from '@/models/Announcement';

export async function GET() {
    try {
        await connectDB()
        const announcements = await Announcement.find().sort({ createdAt: -1 })
        return NextResponse.json(announcements, {status: 200 })
    } catch (error: unknown) { // Changed 'any' to 'unknown'
        console.error('API Route ERROR: Unhandled exception in /api/announcements/get:', error);
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
