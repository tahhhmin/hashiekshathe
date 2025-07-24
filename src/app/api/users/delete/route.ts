// app/api/users/delete/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/connectDB"; // Adjust path as needed
import User from "@/models/User"; // Adjust path as needed
import { getDataFromToken } from "@/utils/getDataFromToken"; // Adjust path as needed

/**
 * Handles user deletion. Requires authentication.
 * @param request The NextRequest object.
 * @returns A NextResponse object indicating success or failure.
 */
export async function DELETE(request: NextRequest) {
    try {
        await connectDB(); // Connect to the database

        // Get user ID from the token
        const userId = getDataFromToken(request);

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized: No user ID found in token" }, { status: 401 });
        }

        // Find and delete the user
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Clear the token cookie after deletion
        const response = NextResponse.json({
            message: "User deleted successfully",
            success: true,
        }, { status: 200 });

        response.cookies.set("token", "", {
            httpOnly: true,
            expires: new Date(0), // Set expiry to past date to delete
            secure: process.env.NODE_ENV === "production",
        });

        return response;

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error during user deletion:", error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        console.error("Unknown error during user deletion:", error);
        return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
    }
}
