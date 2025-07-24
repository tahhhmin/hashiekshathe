// app/api/users/signup/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/connectDB"; // Adjust path as needed
import User from "@/models/User"; // Adjust path as needed
import bcryptjs from "bcryptjs";

/**
 * Handles user signup.
 * @param request The NextRequest object containing the request body.
 * @returns A NextResponse object indicating success or failure.
 */
export async function POST(request: NextRequest) {
    try {
        await connectDB(); // Connect to the database

        const reqBody = await request.json();
        const {
            firstName,
            lastName,
            middleName,
            username,
            email,
            password,
            phoneNumber,
            dateOfBirth,
            gender,
            institution,
            educationLevel,
            address,
            location,
        } = reqBody;

        // --- Input Validation ---
        if (!firstName || !lastName || !username || !email || !password || !phoneNumber || !dateOfBirth || !gender || !institution || !educationLevel || !address || !location) {
            return NextResponse.json({ error: "All required fields must be provided" }, { status: 400 });
        }

        // --- Check if user already exists ---
        const userExists = await User.findOne({ $or: [{ email }, { username }, { phoneNumber }] });

        if (userExists) {
            let errorMessage = "User already exists with this ";
            if (userExists.email === email) errorMessage += "email.";
            else if (userExists.username === username) errorMessage += "username.";
            else if (userExists.phoneNumber === phoneNumber) errorMessage += "phone number.";
            return NextResponse.json({ error: errorMessage }, { status: 400 });
        }

        // --- Hash password ---
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // --- Create new user ---
        const newUser = new User({
            firstName,
            lastName,
            middleName,
            username,
            email,
            password: hashedPassword,
            phoneNumber,
            dateOfBirth,
            gender,
            institution,
            educationLevel,
            address,
            location,
            isVerified: false, // Default to false, can be verified later if needed
            isAdmin: false, // Default to false as per schema
            teamName: "No Team", // Default as per schema
            teamRole: "Member", // Default as per schema
            isDeptMember: false, // Default as per schema
            department: undefined, // Default as per schema (undefined if isDeptMember is false)
        });

        const savedUser = await newUser.save();
        console.log("User signed up:", savedUser.username);

        // Return success response
        return NextResponse.json({
            message: "User created successfully",
            success: true,
            user: {
                id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email,
                isVerified: savedUser.isVerified,
            },
        }, { status: 201 });

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error during signup:", error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        console.error("Unknown error during signup:", error);
        return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
    }
}
