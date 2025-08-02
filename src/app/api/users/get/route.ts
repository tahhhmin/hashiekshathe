//src/app/api/users/get/route.ts
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User"; // Adjust the path based on your project structure

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

        // Build query
        let query: any = {};
        
        if (filterDept && filterDept !== 'all') {
            query.department = filterDept;
        }
        
        if (isDeptMember === 'true') {
            query.isDeptMember = true;
        }

        // Build sort object
        let sortObject: any = {};
        if (sortBy === 'department') {
            sortObject = { department: 1, lastName: 1, firstName: 1 };
        } else if (sortBy === 'name') {
            sortObject = { lastName: 1, firstName: 1 };
        } else if (sortBy === 'dateJoined') {
            sortObject = { dateJoined: -1 };
        } else {
            sortObject = { department: 1, lastName: 1, firstName: 1 };
        }

        const users = await User.find(query)
            .select('-password -forgotPasswordToken -loginVerifyToken') // Exclude sensitive fields
            .sort(sortObject)
            .lean();

        // Group users by department for better organization
        const usersByDepartment = users.reduce((acc: any, user: any) => {
            const dept = user.department || 'No Department';
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

    } catch (error) {
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