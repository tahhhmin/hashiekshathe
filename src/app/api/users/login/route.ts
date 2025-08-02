import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/connectDB";
import User from "@/models/User";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/utils/sendMail";
import {
  generateVerificationToken,
  getVerificationTokenExpiry,
} from "@/utils/generateVerification";

/**
 * Login endpoint: verifies credentials, then sends email token.
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { identifier, password } = await request.json();

    // --- Validate Input ---
    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Email/username and password are required." },
        { status: 400 }
      );
    }

    // --- Find User ---
    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { username: identifier.toLowerCase() },
      ],
    }).select("+password");

    if (!user || !user.password) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 400 });
    }

    // --- Compare Password ---
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 400 });
    }

    // --- Generate New Verification Token ---
    const token = generateVerificationToken();
    const expiry = getVerificationTokenExpiry();

    user.verificationToken = token;
    user.verificationTokenExpiry = expiry;
    await user.save();

    // --- Send Email ---
    await sendEmail("loginVerificationCode", {
      to: user.email,
      code: token,
      name: user.firstName,
    });

    return NextResponse.json(
      {
        message: "Verification code sent to your email.",
        success: true,
        requiresVerification: true,
        userId: user._id,
        identifier,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Login Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
