// 3. Enhanced API Route - Verify and Submit
// pages/api/contact/inquiry/verify-submit.js

import { NextRequest, NextResponse } from "next/server";
import InquiryMessage from '@/models/InquiryMessage';
import { connectDB } from '@/config/connectDB';
import { sendEmail } from '@/utils/sendMail'; // For sending confirmation email

/**
 * Handles verifying the code and finalizing the inquiry message.
 */
export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const { email, verificationCode } = body;

        // Validate required fields
        if (!email || !verificationCode) {
            return NextResponse.json(
                { success: false, message: 'Email and verification code are required.' }, 
                { status: 400 }
            );
        }

        // Find the inquiry
        const inquiry = await InquiryMessage.findOne({ email });

        if (!inquiry) {
            return NextResponse.json(
                { success: false, message: 'No pending inquiry found for this email. Please send a verification code first.' }, 
                { status: 404 }
            );
        }

        // Check if there's a verification token
        if (!inquiry.verifyToken) {
            return NextResponse.json(
                { success: false, message: 'No pending verification code found. Please request a new code.' }, 
                { status: 400 }
            );
        }

        // Verify the code
        if (inquiry.verifyToken !== verificationCode.toString()) {
            return NextResponse.json(
                { success: false, message: 'Invalid verification code. Please check and try again.' }, 
                { status: 401 }
            );
        }

        // Check expiry
        if (inquiry.verifyTokenExpiry < new Date()) {
            // Clear expired token
            inquiry.verifyToken = undefined;
            inquiry.verifyTokenExpiry = undefined;
            await inquiry.save();
            
            return NextResponse.json(
                { success: false, message: 'Verification code has expired. Please request a new one.' }, 
                { status: 401 }
            );
        }

        // Code is valid - clear verification fields and mark as submitted
        inquiry.verifyToken = undefined;
        inquiry.verifyTokenExpiry = undefined;
        inquiry.isSubmitted = true;
        inquiry.submittedAt = new Date();
        await inquiry.save();

        // Send confirmation email to user (optional)
        try {
            await sendEmail('inquiryConfirmation', {
                to: email,
                subject: inquiry.subject,
                message: inquiry.message,
            });
        } catch (emailError) {
            console.error('Failed to send confirmation email:', emailError);
            // Don't fail the request if confirmation email fails
        }

        // Send notification email to admin (optional)
        try {
            await sendEmail('newInquiryNotification', {
                to: process.env.ADMIN_EMAIL || 'admin@yoursite.com',
                userEmail: email,
                subject: inquiry.subject,
                message: inquiry.message,
                submittedAt: inquiry.submittedAt,
            });
        } catch (emailError) {
            console.error('Failed to send admin notification:', emailError);
            // Don't fail the request if admin notification fails
        }

        console.log(`[SERVER] Inquiry successfully submitted by ${email}`);

        return NextResponse.json(
            { success: true, message: 'Your inquiry has been submitted successfully! We will get back to you soon.' }, 
            { status: 200 }
        );

    } catch (error) {
        console.error('Error in verify-submit endpoint:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error. Please try again later.' }, 
            { status: 500 }
        );
    }
}
