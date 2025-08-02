import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface CollaborateMessageDocument extends Document {
  // Organisation details
  orgName: string;
  orgType: string;
  orgEmail: string;
  orgWebsiteLink?: string;
  orgSocialLink?: string;
  orgAddress: string;

  // Collaboration details
  collaborationDescription: string;
  proposedTimeline: string;
  collaborationGoals: string;

  // Sender details
  senderName: string;
  senderEmail: string;
  senderContactNumber: string;
  senderSocialLink?: string;
  senderPosition: string;

  // Verification
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpiresAt?: Date;

  // Backend
  adminReplied: boolean;
  adminComment: string;

  createdAt: Date;
  updatedAt: Date;
}

const CollaborateMessageSchema = new Schema<CollaborateMessageDocument>(
  {
    // Organisation details
    orgName: { type: String, required: true },
    orgType: { type: String, required: true },
    orgEmail: { type: String, required: true },
    orgWebsiteLink: { type: String },
    orgSocialLink: { type: String },
    orgAddress: { type: String, required: true },

    // Collaboration details
    collaborationDescription: { type: String, required: true },
    proposedTimeline: { type: String, required: true },
    collaborationGoals: { type: String, required: true },

    // Sender details
    senderName: { type: String, required: true },
    senderEmail: { type: String, required: true },
    senderContactNumber: { type: String, required: true },
    senderSocialLink: { type: String },
    senderPosition: { type: String, required: true },

    // Verification
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationTokenExpiresAt: { type: Date },

    // Admin response
    adminReplied: { type: Boolean, default: false },
    adminComment: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

export default models.CollaborateMessage ||
  model<CollaborateMessageDocument>('CollaborateMessage', CollaborateMessageSchema);
