// app/api/users/logout/route.ts
import { NextRequest, NextResponse } from "next/server";

/**
 * Handles user logout by clearing the authentication token cookie.
 * @param request The NextRequest object.
 * @returns A NextResponse object indicating successful logout.
 */
export async function GET(request: NextRequest) {
    try {
        const response = NextResponse.json({
            message: "Logout successful",
            success: true,
        }, { status: 200 });

        // Clear the token cookie
        response.cookies.set("token", "", {
            httpOnly: true,
            expires: new Date(0), // Set expiry to past date to delete
            secure: process.env.NODE_ENV === "production",
        });

        return response;

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error during logout:", error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        console.error("Unknown error during logout:", error);
        return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
    }
}
