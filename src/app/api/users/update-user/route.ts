// app/api/users/update-user/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/connectDB"; // Adjust path as needed
import User from "@/models/User"; // Adjust path as needed
import { getDataFromToken } from "@/utils/getDataFromToken"; // Adjust path as needed
import bcryptjs from "bcryptjs";

/**
 * Handles user profile updates. Requires authentication.
 * Allows updating most user fields, handles password hashing if password is provided.
 * @param request The NextRequest object containing the update data.
 * @returns A NextResponse object indicating success or failure with the updated user data.
 */
export async function PUT(request: NextRequest) {
    try {
        await connectDB(); // Connect to the database

        // Get user ID from the token
        const userId = getDataFromToken(request);

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized: No user ID found in token" }, { status: 401 });
        }

        const reqBody = await request.json();
        const {
            firstName,
            lastName,
            middleName,
            username,
            email,
            password, // Handle password updates separately
            phoneNumber,
            dateOfBirth,
            gender,
            avatar,
            institution,
            educationLevel,
            address,
            location,
            teamName,
            teamRole,
            isDeptMember,
            department,
            // isAdmin and isVerified should not be updated via this endpoint by a regular user
        } = reqBody;

        // Find the user to update
        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Prepare update object, handling specific fields
        const updateData: { [key: string]: any } = {};

        if (firstName !== undefined) updateData.firstName = firstName;
        if (lastName !== undefined) updateData.lastName = lastName;
        if (middleName !== undefined) updateData.middleName = middleName;
        if (avatar !== undefined) updateData.avatar = avatar;
        if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth;
        if (gender !== undefined) updateData.gender = gender;
        if (institution !== undefined) updateData.institution = institution;
        if (educationLevel !== undefined) updateData.educationLevel = educationLevel;
        if (address !== undefined) updateData.address = address;
        if (location !== undefined) updateData.location = location;
        if (teamName !== undefined) updateData.teamName = teamName;
        if (teamRole !== undefined) updateData.teamRole = teamRole;
        if (isDeptMember !== undefined) updateData.isDeptMember = isDeptMember;
        if (department !== undefined) updateData.department = department;

        // Handle unique fields (username, email, phoneNumber) with checks
        if (username !== undefined && username.toLowerCase() !== user.username) {
            const existingUser = await User.findOne({ username: username.toLowerCase() });
            if (existingUser && existingUser._id.toString() !== userId) {
                return NextResponse.json({ error: "Username already taken" }, { status: 400 });
            }
            updateData.username = username.toLowerCase();
        }

        if (email !== undefined && email.toLowerCase() !== user.email) {
            const existingUser = await User.findOne({ email: email.toLowerCase() });
            if (existingUser && existingUser._id.toString() !== userId) {
                return NextResponse.json({ error: "Email already taken" }, { status: 400 });
            }
            updateData.email = email.toLowerCase();
        }

        if (phoneNumber !== undefined && phoneNumber !== user.phoneNumber) {
            const existingUser = await User.findOne({ phoneNumber });
            if (existingUser && existingUser._id.toString() !== userId) {
                return NextResponse.json({ error: "Phone number already taken" }, { status: 400 });
            }
            // Validate phone number format
            if (!/^\+?[0-9\s\-]{7,15}$/.test(phoneNumber)) {
                return NextResponse.json({ error: "Please provide a valid phone number" }, { status: 400 });
            }
            updateData.phoneNumber = phoneNumber;
        }

        // Handle password update if provided
        if (password !== undefined && password.length > 0) {
            const salt = await bcryptjs.genSalt(10);
            updateData.password = await bcryptjs.hash(password, salt);
        }

        // Perform the update
        const updatedUser = await User.findByIdAndUpdate(userId, { $set: updateData }, { new: true, runValidators: true }).select("-password");

        if (!updatedUser) {
            return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
        }

        return NextResponse.json({
            message: "User updated successfully",
            success: true,
            user: updatedUser,
        }, { status: 200 });

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error during user update:", error.message);
            // Handle Mongoose validation errors specifically
            if (error.name === 'ValidationError') {
                const errors: { [key: string]: string } = {};
                for (let field in (error as any).errors) {
                    errors[field] = (error as any).errors[field].message;
                }
                return NextResponse.json({ error: "Validation failed", details: errors }, { status: 400 });
            }
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        console.error("Unknown error during user update:", error);
        return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
    }
}
