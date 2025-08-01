import { NextRequest, NextResponse } from "next/server";
import Announcement from "@/models/Announcement";
import { connectDB } from "@/config/connectDB";

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();

        const {
        title,
        subtitle,
        description,
        tags,
        links,
        sendMailToAll,
        } = body;

        if (!title || !description || !tags || sendMailToAll === undefined) {
        return NextResponse.json(
            {
            success: false,
            message: "Title, description, tags, and sendMailToAll are required.",
            },
            { status: 400 }
        );
        }

        if (title.length > 50) {
        return NextResponse.json(
            {
            success: false,
            message: "Title cannot be more than 50 characters.",
            },
            { status: 400 }
        );
        }

        if (description.length > 2000) {
        return NextResponse.json(
            {
            success: false,
            message: "Description cannot be more than 500 characters.",
            },
            { status: 400 }
        );
        }

        const newAnnouncement = new Announcement({
        title,
        subtitle,
        description,
        tags,
        links,
        sendMailToAll,
        });

        await newAnnouncement.save();

        return NextResponse.json(
        { success: true, message: "Announcement created successfully." },
        { status: 201 }
        );
    } catch (error) {
        console.error("Error creating announcement:", error);
        return NextResponse.json(
        {
            success: false,
            message: "An error occurred while creating the announcement.",
        },
        { status: 500 }
        );
    }
}