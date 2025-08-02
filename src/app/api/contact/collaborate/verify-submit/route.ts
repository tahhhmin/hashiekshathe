import { NextRequest, NextResponse } from 'next/server';
import CollaborateMessage from '@/models/CollaborateMessage';
import { connectDB } from '@/config/connectDB';
import { sendEmail } from '@/utils/sendMail';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { email, verificationCode } = await request.json();

    if (!email || !verificationCode) {
      return NextResponse.json(
        { success: false, message: 'Email and verification code are required.' },
        { status: 400 }
      );
    }

    const collaboration = await CollaborateMessage.findOne({ senderEmail: email });

    if (!collaboration) {
      return NextResponse.json(
        { success: false, message: 'No pending request found for this email.' },
        { status: 404 }
      );
    }

    if (!collaboration.verificationToken) {
      return NextResponse.json(
        { success: false, message: 'No verification code was requested.' },
        { status: 400 }
      );
    }

    if (collaboration.verificationToken !== verificationCode.toString()) {
      return NextResponse.json(
        { success: false, message: 'Invalid verification code.' },
        { status: 401 }
      );
    }

    if (collaboration.verificationTokenExpiresAt! < new Date()) {
      collaboration.verificationToken = undefined;
      collaboration.verificationTokenExpiresAt = undefined;
      await collaboration.save();

      return NextResponse.json(
        { success: false, message: 'Verification code expired. Please request a new one.' },
        { status: 401 }
      );
    }

    collaboration.isVerified = true;
    collaboration.verificationToken = undefined;
    collaboration.verificationTokenExpiresAt = undefined;
    await collaboration.save();

    try {
      await sendEmail('collaborateConfirmation', {
        to: email,
        subject: 'Collaboration Request Confirmed',
        message: `Dear ${collaboration.senderName}, your collaboration request has been successfully verified.`,
      });
    } catch (emailError) {
      console.error('Confirmation email failed:', emailError);
    }

    return NextResponse.json(
      { success: true, message: 'Collaboration request verified successfully.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Collaboration verification error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error. Please try again later.' },
      { status: 500 }
    );
  }
}
