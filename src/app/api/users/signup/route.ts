// app/api/users/signup/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/connectDB"; // make sure you have a MongoDB connector
import User from "@/models/User";
import { IUser } from "@/models/User";
import { sendEmail } from "@/utils/sendMail";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();

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
        } = body;

        // --- VALIDATION ---
        if (
        !firstName || !lastName || !username || !email || !password ||
        !phoneNumber || !dateOfBirth || !gender || !institution ||
        !educationLevel || !address
        ) {
        return NextResponse.json(
            { success: false, message: "All required fields must be provided." },
            { status: 400 }
        );
        }

        // --- CHECK IF USER ALREADY EXISTS ---
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
        return NextResponse.json(
            { success: false, message: "Email already in use." },
            { status: 409 }
        );
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
        return NextResponse.json(
            { success: false, message: "Username already in use." },
            { status: 409 }
        );
        }

        const existingPhone = await User.findOne({ phoneNumber });
        if (existingPhone) {
        return NextResponse.json(
            { success: false, message: "Phone number already in use." },
            { status: 409 }
        );
        }

        // --- CREATE USER ---
        const newUser: Partial<IUser> = await User.create({
        firstName,
        lastName,
        middleName: middleName || "", // optional
        username,
        email,
        password,
        phoneNumber,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        institution,
        educationLevel,
        address,
        isVerified: false,
        adminType: "none",
        isAdmin: false,
        isSuperAdmin: false,
        organization: {
            type: "none",
        },
        });

        await sendEmail("signupConfirmation", {
            to: email,
            name: firstName + middleName + lastName,
            username: username,
            phoneNumber: phoneNumber,
        });

        return NextResponse.json(
        { success: true, message: "User registered successfully.", userId: newUser._id },
        { status: 201 }
        );
    } catch (error) {
        console.error("Signup Error:", error);
        return NextResponse.json(
        { success: false, message: "Internal server error." },
        { status: 500 }
        );
    }
}
