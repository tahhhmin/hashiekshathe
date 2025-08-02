// app/api/users/update-user/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/connectDB";
import User from "@/models/User";
import { getDataFromToken } from "@/utils/getDataFromToken";
import bcrypt from "bcryptjs";



const departments = [
  "Administration", "Human Resources", "Finance & Accounting", 
  "Project Operations & Management", "Outreach & Strategic Relations",
  "Communications & Marketing", "Digital Operations",  
  "Education & Youth Development"
] as const;

const teams = [
  "Dhaka", "Faridpur", "Gazipur", "Gopalganj", "Kishoreganj", "Madaripur",
  "Manikganj", "Munshiganj", "Narayanganj", "Narsingdi", "Rajbari", "Shariatpur", "Tangail",
  "Bandarban", "Brahmanbaria", "Chandpur", "Chattogram", "Cumilla", "Cox's Bazar",
  "Feni", "Khagrachari", "Lakshmipur", "Noakhali", "Rangamati",
  "Bogura", "Chapainawabganj", "Joypurhat", "Naogaon", "Natore",
  "Pabna", "Rajshahi", "Sirajganj",
  "Bagerhat", "Chuadanga", "Jashore", "Jhenaidah", "Khulna",
  "Kushtia", "Magura", "Meherpur", "Narail", "Satkhira",
  "Barishal", "Barguna", "Bhola", "Jhalokathi", "Patuakhali", "Pirojpur",
  "Habiganj", "Moulvibazar", "Sunamganj", "Sylhet",
  "Jamalpur", "Mymensingh", "Netrokona", "Sherpur",
  "Dinajpur", "Gaibandha", "Kurigram", "Lalmonirhat", "Nilphamari",
  "Panchagarh", "Rangpur", "Thakurgaon"
] as const;

const combinedOrganisationTeamDept = [...departments, ...teams] as const;

type OrganisationName = typeof combinedOrganisationTeamDept[number];

interface SocialMedia {
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  github?: string;
  website?: string;
}

interface UpdateData {
    firstName?: string;
    lastName?: string;
    middleName?: string;
    username?: string;
    email?: string;
    password?: string;
    phoneNumber?: string;
    dateOfBirth?: string | Date;
    gender?: "male" | "female" | "other";
    avatar?: string;
    biography?: string;
    institution?: string;
    educationLevel?: "SSC/O-Level" | "HSC/A-Level" | "Undergrad";
    address?: string;
    organization?: {
        type?: "team" | "department" | "none";
        name?: OrganisationName; 
        role?: string;
    };
    socialMedia?: SocialMedia;
}

// Fields not allowed to be updated here
const RESTRICTED_FIELDS = [
  "isAdmin",
  "isSuperAdmin",
  "isVerified",
  "dateJoined",
  "forgotPasswordToken",
  "forgotPasswordTokenExpiry",
  "verificationToken",
  "verificationTokenExpiry",
];

// Email validation regex
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Phone number validation regex
function isValidPhoneNumber(phoneNumber: string): boolean {
  return /^\+?[0-9\s\-]{7,15}$/.test(phoneNumber);
}

// Password validation: min 8 chars, at least one letter and one number
function isValidPassword(password: string): boolean {
  return (
    password.length >= 8 &&
    /[A-Za-z]/.test(password) &&
    /\d/.test(password)
  );
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const userId = getDataFromToken(request);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized: No user ID found in token" },
        { status: 401 }
      );
    }

    const reqBody: UpdateData = await request.json();

    // Remove restricted fields if present
    RESTRICTED_FIELDS.forEach((field) => {
      if (field in reqBody) {
        delete reqBody[field as keyof UpdateData];
      }
    });

    // Fetch the user
    const user = await User.findById(userId).select("+password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updateData: any = {};

    // Validate and assign fields

    if (reqBody.firstName !== undefined) {
      if (typeof reqBody.firstName !== "string" || reqBody.firstName.trim() === "") {
        return NextResponse.json(
          { error: "First name must be a non-empty string" },
          { status: 400 }
        );
      }
      updateData.firstName = reqBody.firstName.trim();
    }

    if (reqBody.lastName !== undefined) {
      if (typeof reqBody.lastName !== "string" || reqBody.lastName.trim() === "") {
        return NextResponse.json(
          { error: "Last name must be a non-empty string" },
          { status: 400 }
        );
      }
      updateData.lastName = reqBody.lastName.trim();
    }

    if (reqBody.middleName !== undefined) {
      updateData.middleName = reqBody.middleName?.trim() || "";
    }

    if (reqBody.username !== undefined && reqBody.username.toLowerCase() !== user.username) {
      if (typeof reqBody.username !== "string" || reqBody.username.trim().length < 3) {
        return NextResponse.json(
          { error: "Username must be at least 3 characters long" },
          { status: 400 }
        );
      }
      // Check uniqueness
      const existingUser = await User.findOne({
        username: reqBody.username.toLowerCase(),
      });
      if (existingUser && existingUser._id.toString() !== userId) {
        return NextResponse.json({ error: "Username already taken" }, { status: 400 });
      }
      updateData.username = reqBody.username.toLowerCase().trim();
    }

    if (reqBody.email !== undefined && reqBody.email.toLowerCase() !== user.email) {
      if (!isValidEmail(reqBody.email)) {
        return NextResponse.json(
          { error: "Please provide a valid email address" },
          { status: 400 }
        );
      }
      // Check uniqueness
      const existingUser = await User.findOne({
        email: reqBody.email.toLowerCase(),
      });
      if (existingUser && existingUser._id.toString() !== userId) {
        return NextResponse.json({ error: "Email already taken" }, { status: 400 });
      }
      updateData.email = reqBody.email.toLowerCase().trim();
    }

    if (reqBody.password !== undefined) {
      if (!isValidPassword(reqBody.password)) {
        return NextResponse.json(
          {
            error:
              "Password must be at least 8 characters long and contain at least one letter and one number",
          },
          { status: 400 }
        );
      }
      // Hash password before updating
      const hashedPassword = await bcrypt.hash(reqBody.password, 10);
      updateData.password = hashedPassword;
    }

    if (reqBody.phoneNumber !== undefined) {
      if (!isValidPhoneNumber(reqBody.phoneNumber)) {
        return NextResponse.json(
          { error: "Please provide a valid phone number" },
          { status: 400 }
        );
      }
      updateData.phoneNumber = reqBody.phoneNumber.trim();
    }

    if (reqBody.dateOfBirth !== undefined) {
      const dob = new Date(reqBody.dateOfBirth);
      if (isNaN(dob.getTime())) {
        return NextResponse.json({ error: "Invalid date of birth" }, { status: 400 });
      }
      updateData.dateOfBirth = dob;
    }

    if (reqBody.gender !== undefined) {
      if (!["male", "female", "other"].includes(reqBody.gender)) {
        return NextResponse.json(
          { error: "Gender must be 'male', 'female', or 'other'" },
          { status: 400 }
        );
      }
      updateData.gender = reqBody.gender;
    }

    if (reqBody.avatar !== undefined) {
      updateData.avatar = reqBody.avatar?.trim() || "";
    }

    if (reqBody.biography !== undefined) {
        updateData.biography = reqBody.biography?.trim() || " "
    }

    if (reqBody.institution !== undefined) {
      if (typeof reqBody.institution !== "string") {
        return NextResponse.json({ error: "Institution must be a string" }, { status: 400 });
      }
      updateData.institution = reqBody.institution.trim();
    }

    if (reqBody.educationLevel !== undefined) {
      if (!["SSC/O-Level", "HSC/A-Level", "Undergrad"].includes(reqBody.educationLevel)) {
        return NextResponse.json(
          {
            error:
              "Education level must be one of 'SSC/O-Level', 'HSC/A-Level', or 'Undergrad'",
          },
          { status: 400 }
        );
      }
      updateData.educationLevel = reqBody.educationLevel;
    }

    if (reqBody.address !== undefined) {
      if (typeof reqBody.address !== "string") {
        return NextResponse.json({ error: "Address must be a string" }, { status: 400 });
      }
      updateData.address = reqBody.address.trim();
    }

    // Organization object updates
    if (reqBody.organization !== undefined) {
      const org = reqBody.organization;
      const orgUpdate: any = {};
      if (org.type !== undefined) {
        if (!["team", "department", "none"].includes(org.type)) {
          return NextResponse.json(
            { error: "Organization type must be 'team', 'department', or 'none'" },
            { status: 400 }
          );
        }
        orgUpdate.type = org.type;
      }
      if (org.name !== undefined) {
        orgUpdate.name = typeof org.name === "string" ? org.name.trim() : "";
      }
      if (org.role !== undefined) {
        orgUpdate.role = typeof org.role === "string" ? org.role.trim() : "";
      }
      updateData.organization = { ...user.organization?.toObject(), ...orgUpdate };
    }

    // Social Media updates
    if (reqBody.socialMedia && typeof reqBody.socialMedia === "object") {
      const allowedSocialFields = [
        "facebook",
        "twitter",
        "linkedin",
        "instagram",
        "github",
        "website",
      ];

      const socialUpdate: any = user.socialMedia
        ? { ...user.socialMedia.toObject() }
        : {};

      for (const key of Object.keys(reqBody.socialMedia)) {
        if (allowedSocialFields.includes(key)) {
          const val = reqBody.socialMedia[key as keyof SocialMedia];
          socialUpdate[key] = typeof val === "string" ? val.trim() : "";
        }
      }

      updateData.socialMedia = socialUpdate;
    }

    // Update the user
    await User.findByIdAndUpdate(userId, updateData, { new: true });

    return NextResponse.json({ message: "User updated successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
