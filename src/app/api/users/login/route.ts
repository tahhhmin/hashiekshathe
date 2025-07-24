// app/api/users/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/connectDB"; // Adjust path as needed
import User from "@/models/User"; // Adjust path as needed
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/utils/sendMail"; // Adjust path as needed
import { generateVerificationToken, getVerificationTokenExpiry } from "@/utils/generateVerification"; // Adjust path as needed

/**
 * Handles user login. Authenticates credentials, sends a verification code,
 * and signals to the frontend that verification is required. Does NOT issue JWT yet.
 * @param request The NextRequest object containing the request body.
 * @returns A NextResponse object indicating success or failure, and if verification is needed.
 */
export async function POST(request: NextRequest) {
    try {
        await connectDB(); // Connect to the database

        const reqBody = await request.json();
        const { identifier, password } = reqBody; // 'identifier' can be email or username

        // --- Input Validation ---
        if (!identifier || !password) {
            return NextResponse.json({ error: "Identifier (email or username) and password are required" }, { status: 400 });
        }

        // --- Find user by email or username ---
        const user = await User.findOne({
            $or: [{ email: identifier.toLowerCase() }, { username: identifier.toLowerCase() }]
        }).select("+password"); // Select password field explicitly

        if (!user) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
        }

        // --- Compare passwords ---
        const isMatch = await bcryptjs.compare(password, user.password);

        if (!isMatch) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
        }

        // --- Always generate and save new verification token for login ---
        const loginVerifyToken = generateVerificationToken();
        const loginVerifyTokenExpiry = getVerificationTokenExpiry();

        user.loginVerifyToken = loginVerifyToken;
        user.loginVerifyTokenExpiry = loginVerifyTokenExpiry;
        await user.save();

        // --- Send verification email ---
        await sendEmail("loginVerificationCode", { // Ensure you have this template
            to: user.email,
            code: loginVerifyToken,
            name: user.firstName,
        });

        // --- Respond, indicating verification is required (no JWT yet) ---
        return NextResponse.json({
            message: "Login successful. A verification code has been sent to your email. Please verify to complete login.",
            success: true,
            requiresVerification: true, // Always true for this flow
            userId: user._id,
            identifier: identifier, // Pass identifier back for convenience in frontend
        }, { status: 200 });

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error during login (code sending):", error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        console.error("Unknown error during login (code sending):", error);
        return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
    }
}
