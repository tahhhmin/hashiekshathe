// /api/collaborate/submit.ts

import { NextRequest, NextResponse } from 'next/server';
import CollaborateMessage from '@/models/CollaborateMessage';
import { connectDB } from '@/config/connectDB';
import { sendEmail } from '@/utils/sendMail';
import { generateVerificationToken, getVerificationTokenExpiry } from '@/utils/generateVerification';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      orgName,
      orgType,
      orgEmail,
      orgWebsiteLink,
      orgSocialLink,
      orgAddress,
      collaborationDescription,
      proposedTimeline,
      collaborationGoals,
      senderName,
      senderEmail,
      senderContactNumber,
      senderSocialLink,
      senderPosition
    } = body;

    if (
      !orgName || !orgType || !orgEmail || !orgAddress ||
      !collaborationDescription || !proposedTimeline || !collaborationGoals ||
      !senderName || !senderEmail || !senderContactNumber || !senderPosition
    ) {
      return NextResponse.json(
        { success: false, message: 'Required fields are missing.' },
        { status: 400 }
      );
    }

    const token = generateVerificationToken();
    const expiresAt = getVerificationTokenExpiry();

    let requestDoc = await CollaborateMessage.findOne({ senderEmail });

    if (requestDoc) {
      requestDoc.set({
        orgName,
        orgType,
        orgEmail,
        orgWebsiteLink,
        orgSocialLink,
        orgAddress,
        collaborationDescription,
        proposedTimeline,
        collaborationGoals,
        senderName,
        senderContactNumber,
        senderSocialLink,
        senderPosition,
        verificationToken: token,
        verificationTokenExpiresAt: expiresAt,
        isVerified: false
      });
    } else {
      requestDoc = await CollaborateMessage.create({
        orgName,
        orgType,
        orgEmail,
        orgWebsiteLink,
        orgSocialLink,
        orgAddress,
        collaborationDescription,
        proposedTimeline,
        collaborationGoals,
        senderName,
        senderEmail,
        senderContactNumber,
        senderSocialLink,
        senderPosition,
        verificationToken: token,
        verificationTokenExpiresAt: expiresAt,
        isVerified: false
      });
    }

    await requestDoc.save();

    // Send the email
    try {
      await sendEmail('inquiryVerificationCode', {
        to: senderEmail,
        code: token,
        subject: 'Collaboration Request Verification Code'
      });
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      await CollaborateMessage.deleteOne({ _id: requestDoc._id });
      return NextResponse.json(
        { success: false, message: 'Verification email failed to send.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Verification code sent to your email.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Collaboration submit error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error. Please try again later.' },
      { status: 500 }
    );
  }
}
