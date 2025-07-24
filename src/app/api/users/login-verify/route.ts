// app/api/users/login-verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/connectDB"; // Adjust path as needed
import User from "@/models/User"; // Adjust path as needed
import jwt from "jsonwebtoken";

/**
 * Handles login verification using a token sent to the user's email.
 * If successful, sets isVerified to true and issues the JWT token.
 * @param request The NextRequest object containing the request body (identifier and token).
 * @returns A NextResponse object indicating success or failure, and sets a token cookie if successful.
 */
export async function POST(request: NextRequest) {
    try {
        await connectDB(); // Connect to the database

        const reqBody = await request.json();
        const { identifier, loginVerifyToken } = reqBody; // 'identifier' can be email or username

        // --- Input Validation ---
        if (!identifier || !loginVerifyToken) {
            return NextResponse.json({ error: "Identifier and verification token are required" }, { status: 400 });
        }

        // --- Find user ---
        const user = await User.findOne({
            $or: [{ email: identifier.toLowerCase() }, { username: identifier.toLowerCase() }]
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // --- Validate token and expiry ---
        if (user.loginVerifyToken !== loginVerifyToken || !user.loginVerifyToken || user.loginVerifyTokenExpiry! < new Date()) {
            return NextResponse.json({ error: "Invalid or expired verification token" }, { status: 400 });
        }

        // --- Update user verification status and clear tokens ---
        user.isVerified = true; // Set to true after successful verification
        user.loginVerifyToken = undefined;
        user.loginVerifyTokenExpiry = undefined;
        await user.save();

        // --- Generate JWT token for the now verified user ---
        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email,
        };
        const token = jwt.sign(tokenData, process.env.JWT_SECRET!, { expiresIn: "1d" });

        // --- Set token in HTTP-only cookie ---
        const response = NextResponse.json({
            message: "Account verified successfully. You are now logged in.",
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                isVerified: user.isVerified,
            },
        }, { status: 200 });

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24, // 1 day
        });

        return response;

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error during login verification:", error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        console.error("Unknown error during login verification:", error);
        return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
    }
}
