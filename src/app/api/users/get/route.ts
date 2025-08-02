//src/app/api/users/get/route.ts
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import User, { IUser } from "@/models/User";

// Define a type for the data returned by the .lean() query.
// It uses Partial to make all fields optional, then Omit to exclude
// the sensitive fields that are explicitly not selected.
type LeanUser = Partial<Omit<IUser,
  'password' | 
  'forgotPasswordToken' | 
  'loginVerifyToken'
>>;

// Connect to MongoDB
const connectDB = async () => {
    if (mongoose.connections[0].readyState) {
        return;
    }
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
    } catch (error) {
        console.error("Database connection error:", error);
        throw new Error("Database connection failed");
    }
};

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const sortBy = searchParams.get('sortBy') || 'department';
        const filterDept = searchParams.get('department');
        const isDeptMember = searchParams.get('isDeptMember');

        // Use 'const' since the object is not reassigned
        const query: { [key: string]: unknown } = {}; 
        
        if (filterDept && filterDept !== 'all') {
            query['organization.name'] = filterDept;
        }
        
        if (isDeptMember === 'true') {
            query['organization.type'] = 'department';
        }

        // Use 'const' since the object is not reassigned
        const sortObject: { [key: string]: 1 | -1 } = {};
        if (sortBy === 'department') {
            sortObject['organization.name'] = 1;
            sortObject.lastName = 1;
            sortObject.firstName = 1;
        } else if (sortBy === 'name') {
            sortObject.lastName = 1;
            sortObject.firstName = 1;
        } else if (sortBy === 'dateJoined') {
            sortObject.dateJoined = -1;
        } else {
            sortObject['organization.name'] = 1;
            sortObject.lastName = 1;
            sortObject.firstName = 1;
        }

        // Correctly cast the result of the .lean() query to the new LeanUser[] type
        const users = await User.find(query)
            .select('-password -forgotPasswordToken -loginVerifyToken') 
            .sort(sortObject)
            .lean() as LeanUser[];

        // Use the correct LeanUser type for the accumulator in the reduce function
        const usersByDepartment = users.reduce((acc: Record<string, LeanUser[]>, user: LeanUser) => {
            const dept = user.organization?.name || 'No Department';
            if (!acc[dept]) {
                acc[dept] = [];
            }
            acc[dept].push(user);
            return acc;
        }, {});

        return NextResponse.json({
            success: true,
            data: {
                users,
                usersByDepartment,
                totalUsers: users.length,
                departments: Object.keys(usersByDepartment)
            }
        });

    } catch (error: unknown) { // Use 'unknown' for type safety
        console.error("Error fetching users:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch users",
                error: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}
