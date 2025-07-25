// 4. Enhanced Mongoose Model
// models/InquiryMessage.js

import mongoose from "mongoose";

const inquiryMessageSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please provide email"],
        lowercase: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please fill a valid email address']
    },
    subject: {
        type: String,
        required: [true, "Please provide a subject"],
        trim: true,
        maxlength: [200, "Subject cannot be more than 200 characters"]
    },
    message: {
        type: String,
        required: [true, "Please provide a message"],
        trim: true,
        maxlength: [2000, "Message cannot be more than 2000 characters"]
    },
    verifyToken: {
        type: String,
        default: undefined
    },
    verifyTokenExpiry: {
        type: Date,
        default: undefined
    },
    isSubmitted: {
        type: Boolean,
        default: false
    },
    submittedAt: {
        type: Date,
        default: undefined
    },
    status: {
        type: String,
        enum: ['pending', 'submitted', 'read', 'responded'],
        default: 'pending'
    }
}, {
    timestamps: true
});

// Clean up expired tokens periodically
inquiryMessageSchema.pre('save', function(next) {
    if (this.verifyTokenExpiry && this.verifyTokenExpiry < new Date()) {
        this.verifyToken = undefined;
        this.verifyTokenExpiry = undefined;
    }
    next();
});

// Virtual for checking if verification is pending
inquiryMessageSchema.virtual('isVerificationPending').get(function() {
    return this.verifyToken && this.verifyTokenExpiry && this.verifyTokenExpiry > new Date();
});

const InquiryMessage = mongoose.models.InquiryMessage || mongoose.model("InquiryMessage", inquiryMessageSchema);

export default InquiryMessage;