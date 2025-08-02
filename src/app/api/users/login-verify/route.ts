import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/connectDB";
import User from "@/models/User";
import jwt from "jsonwebtoken";

/**
 * Verifies login token and issues JWT cookie.
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { identifier, token: submittedToken } = await request.json();

    if (!identifier || !submittedToken) {
      return NextResponse.json(
        { error: "Identifier and verification token are required." },
        { status: 400 }
      );
    }

    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { username: identifier.toLowerCase() },
      ],
    });

    if (
      !user ||
      !user.verificationToken ||
      user.verificationToken !== submittedToken ||
      user.verificationTokenExpiry! < new Date()
    ) {
      return NextResponse.json(
        { error: "Invalid or expired verification token." },
        { status: 400 }
      );
    }

    // --- Clear Token and Mark Verified ---
    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpiry = null;
    await user.save();

    // --- Generate JWT ---
    const tokenData = {
      id: user._id,
      email: user.email,
      username: user.username,
      isAdmin: user.isAdmin,
      isSuperAdmin: user.isSuperAdmin,
      adminType: user.adminType,
    };

    const token = jwt.sign(tokenData, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    const response = NextResponse.json(
      {
        message: "Login verified. Welcome back!",
        success: true,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          isVerified: user.isVerified,
          isAdmin: user.isAdmin,
          isSuperAdmin: user.isSuperAdmin,
          adminType: user.adminType,
        },
      },
      { status: 200 }
    );

    // --- Set JWT Cookie ---
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Login Verify Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
