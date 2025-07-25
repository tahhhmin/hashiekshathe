import { NextRequest, NextResponse } from "next/server";
import InquiryMessage from "@/models/InquiryMessage";
import { sendEmail } from "@/utils/sendMail";
import { connectDB } from "@/config/connectDB";
import { generateVerificationToken, getVerificationTokenExpiry } from "@/utils/generateVerification";

/**
 * Custom type guard for Mongoose validation error.
 */
function isMongooseValidationError(
  error: unknown
): error is Error & { errors: Record<string, { message: string }> } {
  // Check if it's an Error instance with the name 'ValidationError'
  if (!(error instanceof Error) || error.name !== "ValidationError") {
    return false;
  }

  // Check if 'errors' property exists and is an object, and not null
  // We cast to a type that *might* have 'errors' to safely check its type
  const potentialErrorWithErrors = error as { errors?: unknown };
  return (
    "errors" in potentialErrorWithErrors &&
    typeof potentialErrorWithErrors.errors === "object" &&
    potentialErrorWithErrors.errors !== null
  );
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { email, subject, message } = body;

    // Validate required fields
    if (!email || !subject || !message) {
      return NextResponse.json(
        { success: false, message: "Email, subject, and message are required." },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // Validate subject and message length
    if (subject.length > 200) {
      return NextResponse.json(
        { success: false, message: "Subject cannot be more than 200 characters." },
        { status: 400 }
      );
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { success: false, message: "Message cannot be more than 2000 characters." },
        { status: 400 }
      );
    }

    const verifyToken = generateVerificationToken();
    const verifyTokenExpiry = getVerificationTokenExpiry();

    let inquiry = await InquiryMessage.findOne({ email });

    if (inquiry) {
      inquiry.subject = subject;
      inquiry.message = message;
      inquiry.verifyToken = verifyToken;
      inquiry.verifyTokenExpiry = verifyTokenExpiry;
      await inquiry.save();
    } else {
      inquiry = await InquiryMessage.create({
        email,
        subject,
        message,
        verifyToken,
        verifyTokenExpiry,
      });
    }

    // Send verification email
    try {
      await sendEmail("inquiryVerificationCode", {
        to: email,
        code: verifyToken,
        subject,
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // If email sending fails, delete the created inquiry message to prevent orphaned data
      await InquiryMessage.deleteOne({ _id: inquiry._id });
      return NextResponse.json(
        { success: false, message: "Failed to send verification email. Please check your email address and try again." },
        { status: 503 }
      );
    }

    console.log(`[SERVER] Sent verification code ${verifyToken} to ${email}`);

    return NextResponse.json(
      { success: true, message: "Verification code sent successfully. Please check your email." },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error in inquiry submit handler:", error);

    if (isMongooseValidationError(error)) {
      // The type guard ensures `error.errors` is now correctly typed
      const messages = Object.values(error.errors).map((e) => e.message);
      return NextResponse.json(
        { success: false, message: "Validation error: " + messages.join(", ") },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
