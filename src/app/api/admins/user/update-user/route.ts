// app/api/admins/user/update-user/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/connectDB";
import User from "@/models/User";
import bcrypt from "bcryptjs";

interface SocialMedia {
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  github?: string;
  website?: string;
}

interface UpdateData {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  username?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
  dateOfBirth?: string | Date;
  gender?: "male" | "female" | "other";
  avatar?: string;
  institution?: string;
  educationLevel?: "SSC/O-Level" | "HSC/A-Level" | "Undergrad";
  address?: string;
  organization?: {
    type?: "team" | "department" | "none";
    name?: string;
    role?: string;
  };
  socialMedia?: SocialMedia;
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
  adminType?: "departmentAdmin" | "teamAdmin" | "projectAdmin" | "none";
  isVerified?: boolean;
  dateJoined?: string | Date;

  // Must have userId to identify which user to update
  userId: string;
}

// Basic validation functions can be added if you want — here, I keep it minimal

export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const reqBody: UpdateData = await request.json();

    if (!reqBody.userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Prepare update object
    const updateData: any = {};

    if (reqBody.firstName !== undefined) updateData.firstName = reqBody.firstName.trim();
    if (reqBody.lastName !== undefined) updateData.lastName = reqBody.lastName.trim();
    if (reqBody.middleName !== undefined) updateData.middleName = reqBody.middleName.trim();
    if (reqBody.username !== undefined) updateData.username = reqBody.username.trim();
    if (reqBody.email !== undefined) updateData.email = reqBody.email.trim();
    if (reqBody.phoneNumber !== undefined) updateData.phoneNumber = reqBody.phoneNumber.trim();
    if (reqBody.dateOfBirth !== undefined) updateData.dateOfBirth = new Date(reqBody.dateOfBirth);
    if (reqBody.gender !== undefined) updateData.gender = reqBody.gender;
    if (reqBody.avatar !== undefined) updateData.avatar = reqBody.avatar.trim();
    if (reqBody.institution !== undefined) updateData.institution = reqBody.institution.trim();
    if (reqBody.educationLevel !== undefined) updateData.educationLevel = reqBody.educationLevel;
    if (reqBody.address !== undefined) updateData.address = reqBody.address.trim();

    if (reqBody.organization !== undefined) {
      updateData.organization = reqBody.organization;
    }

    if (reqBody.socialMedia !== undefined) {
      updateData.socialMedia = reqBody.socialMedia;
    }

    if (reqBody.isAdmin !== undefined) updateData.isAdmin = Boolean(reqBody.isAdmin);
    if (reqBody.isSuperAdmin !== undefined) updateData.isSuperAdmin = Boolean(reqBody.isSuperAdmin);
    if (reqBody.adminType !== undefined) updateData.adminType = reqBody.adminType;
    if (reqBody.isVerified !== undefined) updateData.isVerified = Boolean(reqBody.isVerified);
    if (reqBody.dateJoined !== undefined) updateData.dateJoined = new Date(reqBody.dateJoined);

    // If password is provided, hash it before updating
    if (reqBody.password !== undefined) {
      const hashedPassword = await bcrypt.hash(reqBody.password, 10);
      updateData.password = hashedPassword;
    }

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(reqBody.userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "User updated successfully",
      user: updatedUser,
    }, { status: 200 });

  } catch (error: any) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
