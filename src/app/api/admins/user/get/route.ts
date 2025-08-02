import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/connectDB";
import User from "@/models/User";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'dateJoined';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const filter = searchParams.get('filter') || 'all'; // all, verified, unverified, admin, superAdmin

    const skip = (page - 1) * limit;

    // Build search query
    let searchQuery: any = {};
    if (search) {
      searchQuery.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { institution: { $regex: search, $options: 'i' } }
      ];
    }

    // Apply filters
    switch (filter) {
      case 'verified':
        searchQuery.isVerified = true;
        break;
      case 'unverified':
        searchQuery.isVerified = false;
        break;
      case 'admin':
        searchQuery.isAdmin = true;
        break;
      case 'superAdmin':
        searchQuery.isSuperAdmin = true;
        break;
      case 'all':
      default:
        break;
    }

    // Build sort object
    const sortObj: any = {};
    sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Fetch users from DB with pagination
    const users = await User.find(searchQuery)
      .select('-password -forgotPasswordToken -forgotPasswordTokenExpiry -verificationToken -verificationTokenExpiry')
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .lean();

    // Total count for pagination
    const totalUsers = await User.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalUsers / limit);

    // Summary stats
    const stats = await User.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          verified: { $sum: { $cond: ['$isVerified', 1, 0] } },
          unverified: { $sum: { $cond: ['$isVerified', 0, 1] } },
          admins: { $sum: { $cond: ['$isAdmin', 1, 0] } },
          superAdmins: { $sum: { $cond: ['$isSuperAdmin', 1, 0] } }
        }
      }
    ]);

    return NextResponse.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages,
          totalUsers,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        },
        stats: stats[0] || {
          total: 0,
          verified: 0,
          unverified: 0,
          admins: 0,
          superAdmins: 0
        }
      }
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
