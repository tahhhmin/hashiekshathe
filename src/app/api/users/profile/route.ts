// app/api/users/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/connectDB"; // Adjust path as needed
import User from "@/models/User"; // Adjust path as needed
import { getDataFromToken } from "@/utils/getDataFromToken"; // Adjust path as needed

/**
 * Handles fetching the profile of the currently authenticated user.
 * Requires a valid JWT token in the cookie.
 * @param request The NextRequest object.
 * @returns A NextResponse object with user data or an error.
 */
export async function GET(request: NextRequest) {
    try {
        await connectDB(); // Connect to the database

        // Get user ID from the token
        const userId = getDataFromToken(request);

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized: No user ID found in token" }, { status: 401 });
        }

        // Find the user by ID, exclude password and sensitive tokens
        const user = await User.findById(userId).select("-password -forgotPasswordToken -forgotPasswordTokenExpiry -loginVerifyToken -loginVerifyTokenExpiry");

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            message: "User profile fetched successfully",
            success: true,
            data: user, // Return the user object
        }, { status: 200 });

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error fetching user profile:", error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        console.error("Unknown error fetching user profile:", error);
        return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
    }
}
