import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    // Login Details
    isAdmin: { type: Boolean, default: false },

    firstName: { type: String, required: [true, "Please provide first name"], trim: true },
    lastName: { type: String, required: [true, "Please provide last name"], trim: true },
    middleName: { type: String, trim: true, default: "" },
    username: { type: String, required: [true, "Please provide username"],  unique: true, trim: true, lowercase: true, },
    email: { type: String, required: [true, "Please provide email"], unique: true, lowercase: true, trim: true, },
    password: { type: String, required: [true, "Please provide password"], select: false, },
    
    // Password Reset & Verification
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    loginVerifyToken: String,
    loginVerifyTokenExpiry: Date,

    // Personal Details
    avatar: { type: String, trim: true },
    phoneNumber: { type: String, required: [true, "Please provide phone number"], trim: true, match: [/^\+?[0-9\s\-]{7,15}$/, "Please provide a valid phone number"], unique: true},

    dateOfBirth: { type: Date, required: [true, "Please provide date of birth"] },
    gender: { type: String, enum: ["male", "female", "other"], required: [true, "Please provide gender"], },
            
    isVerified: { type: Boolean, default: false },

    institution: { type: String, required: [true, "Please provide institution"], trim: true },
    educationLevel: { type: String, required: [true, "Please provide education level"], trim: true },
    address: { type: String, required: [true, "Please provide address"], trim: true },
    location: { type: String, required: [true, "Please provide location"], trim: true },

    dateJoined: { type: Date, default: Date.now },

    // Team and Department Details
    teamName: { type: String, trim: true, default: "No Team" },
    teamRole: { type: String, trim: true, default: "Member" },

    isDeptMember: { type: Boolean, default: false },
    department: { type: String, trim: true, enum: ["Administration", "Human Resources", "other"] },

}, { timestamps: true });


const User = mongoose.models.users || mongoose.model("users", userSchema);
export default User;