// app/api/admins/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/connectDB"; // Adjust path as needed
import User from "@/models/User"; // Assuming admins are also stored in the User model with isAdmin: true
import { getDataFromToken } from "@/utils/getDataFromToken"; // Adjust path as needed

/**
 * Handles fetching the profile of the currently authenticated admin user.
 * Requires a valid JWT token in the cookie and checks for isAdmin: true.
 * @param request The NextRequest object.
 * @returns A NextResponse object with admin user data or an error.
 */
export async function GET(request: NextRequest) {
    try {
        await connectDB(); // Connect to the database

        // Get user ID from the token
        const userId = getDataFromToken(request);

        if (!userId) {
            console.error("ADMIN PROFILE ERROR: Unauthorized - No user ID found in token.");
            return NextResponse.json({ error: "Unauthorized: No user ID found in token" }, { status: 401 });
        }

        // Find the user by ID, ensure isAdmin is true, and exclude sensitive fields
        const adminUser = await User.findById(userId).select("-password -forgotPasswordToken -forgotPasswordTokenExpiry -loginVerifyToken -loginVerifyTokenExpiry");

        if (!adminUser) {
            console.error(`ADMIN PROFILE ERROR: User with ID ${userId} not found.`);
            return NextResponse.json({ error: "Admin user not found" }, { status: 404 });
        }

        if (!adminUser.isAdmin) {
            console.error(`ADMIN PROFILE ERROR: User with ID ${userId} is not an admin.`);
            return NextResponse.json({ error: "Forbidden: Not an admin user" }, { status: 403 });
        }

        console.log(`ADMIN PROFILE: Successfully fetched profile for admin ${adminUser.username}`);
        return NextResponse.json({
            message: "Admin profile fetched successfully",
            success: true,
            data: adminUser, // Return the admin user object
        }, { status: 200 });

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("ADMIN PROFILE ERROR:", error.message, error.stack); // Log stack trace for better debugging
            return NextResponse.json({ error: error.message || "An internal server error occurred" }, { status: 500 });
        }
        console.error("ADMIN PROFILE ERROR: An unknown error occurred:", error);
        return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
    }
}
