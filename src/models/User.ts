import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// ---
// ## Interface
// ---

export interface IUser extends Document {
    isAdmin: boolean;
    isSuperAdmin: boolean;
    adminType: "recordsAdmin" | "volunteerAdmin" | "projectAdmin" | "educationAdmin" | "contactAdmin" | "announcementAdmin" | "none";
    firstName: string;
    lastName: string;
    middleName?: string;
    username: string;
    email: string;
    password?: string;
    forgotPasswordToken?: string | null;
    forgotPasswordTokenExpiry?: Date | null;
    verificationToken?: string | null;
    verificationTokenExpiry?: Date | null;
    avatar?: string;
    biography?: string;
    phoneNumber: string;
    dateOfBirth: Date;
    gender: "male" | "female" | "other";
    isVerified: boolean;
    institution: string;
    educationLevel: "SSC/O-Level" | "HSC/A-Level" | "Undergrad";
    address: string;
    dateJoined: Date;
    organization: {
        type: "team" | "department" | "none";
        name?: string;
        role?: string;
    };
    socialMedia: {
        facebook?: string;
        twitter?: string;
        linkedin?: string;
        instagram?: string;
        github?: string;
        website?: string;
    };
    fullName?: string;

    comparePassword: (candidatePassword: string) => Promise<boolean>;
    getForgotPasswordToken: () => string;
    getVerificationToken: () => string;
}

// ---
// ## Constants
// ---
const adminTypes = ["recordsAdmin" , "volunteerAdmin" , "projectAdmin" , "educationAdmin" , "contactAdmin" , "announcementAdmin" , "none"];
const departments = ["Administration", "Human Resources", "Finance & Accounting", "Project Operations & Management",  "Outreach & Strategic Relations", 
                        "Communications & Marketing", "Digital Operations",  "Education & Youth Development"];
const teams = [
  // Dhaka Division
    "Dhaka", "Faridpur", "Gazipur", "Gopalganj", "Kishoreganj", "Madaripur",
    "Manikganj", "Munshiganj", "Narayanganj", "Narsingdi", "Rajbari", "Shariatpur", "Tangail",

    // Chattogram Division
    "Bandarban", "Brahmanbaria", "Chandpur", "Chattogram", "Cumilla", "Cox's Bazar",
    "Feni", "Khagrachari", "Lakshmipur", "Noakhali", "Rangamati",

    // Rajshahi Division
    "Bogura", "Chapainawabganj", "Joypurhat", "Naogaon", "Natore",
    "Pabna", "Rajshahi", "Sirajganj",

    // Khulna Division
    "Bagerhat", "Chuadanga", "Jashore", "Jhenaidah", "Khulna",
    "Kushtia", "Magura", "Meherpur", "Narail", "Satkhira",

    // Barishal Division
    "Barishal", "Barguna", "Bhola", "Jhalokathi", "Patuakhali", "Pirojpur",

    // Sylhet Division
    "Habiganj", "Moulvibazar", "Sunamganj", "Sylhet",

    // Mymensingh Division
    "Jamalpur", "Mymensingh", "Netrokona", "Sherpur",

    // Rangpur Division
    "Dinajpur", "Gaibandha", "Kurigram", "Lalmonirhat", "Nilphamari",
    "Panchagarh", "Rangpur", "Thakurgaon"
];
const combinedOrganisationTeamDept = [...departments, ...teams];
const educationLevels = ["SSC/O-Level", "HSC/A-Level", "Undergrad"];

// ---
// ## Schema
// ---

const userSchema = new Schema<IUser>({
    isAdmin: { type: Boolean, default: false },
    isSuperAdmin: { type: Boolean, default: false },
    adminType: {
        type: String,
        enum: adminTypes,
        default: "none",
    },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    middleName: { type: String, trim: true, default: "" },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/.+@.+\..+/, "Please provide a valid email address"],
    },
    password: {
        type: String,
        required: true,
        select: false,
        minlength: 8,
    },
    forgotPasswordToken: { type: String, default: null },
    forgotPasswordTokenExpiry: { type: Date, default: null },
    verificationToken: { type: String, default: null },
    verificationTokenExpiry: { type: Date, default: null },

    avatar: { type: String, trim: true, default: "" },
    biography: { type: String, trim: true, default: "" },
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
        match: [/^\+?[0-9\s\-]{7,15}$/, "Please provide a valid phone number"],
        unique: true,
    },
    dateOfBirth: { type: Date, required: true },
    gender: {
        type: String,
        enum: ["male", "female", "other"],
        required: true,
    },
    isVerified: { type: Boolean, default: false },

    institution: { type: String, required: true, trim: true },
    educationLevel: {
        type: String,
        required: true,
        enum: educationLevels,
        trim: true,
    },
    address: { type: String, required: true, trim: true },
    dateJoined: { type: Date, default: Date.now },

    organization: {
        type: {
            type: String,
            enum: ["team", "department", "none"],
            default: "none",
        },
        name: {
            type: combinedOrganisationTeamDept,
            trim: true,
        },
        role: {
            type: String,
            trim: true,
        },
    },

    socialMedia: {
        facebook: { type: String, trim: true, default: "" },
        twitter: { type: String, trim: true, default: "" },
        linkedin: { type: String, trim: true, default: "" },
        instagram: { type: String, trim: true, default: "" },
        github: { type: String, trim: true, default: "" },
        website: { type: String, trim: true, default: "" },
    },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

// ---
// ## Virtuals
// ---

userSchema.virtual("fullName").get(function(this: IUser) {
    return `${this.firstName} ${this.middleName ? this.middleName + " " : ""}${this.lastName}`;
});

// ---
// ## Methods
// ---

userSchema.pre("save", async function (this: IUser, next) {
    if (!this.isModified("password")) return next();
    if (this.password) this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    if (!this.password) return false;
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.getForgotPasswordToken = function (): string {
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.forgotPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.forgotPasswordTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
    return resetToken;
};

userSchema.methods.getVerificationToken = function (): string {
    const verifyToken = crypto.randomBytes(20).toString("hex");
    this.verificationToken = crypto.createHash("sha256").update(verifyToken).digest("hex");
    this.verificationTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
    return verifyToken;
};

// ---
// ## Export
// ---

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);
export default User;
