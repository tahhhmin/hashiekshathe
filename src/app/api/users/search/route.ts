// app/api/users/search/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/config/connectDB';
import User from '@/models/User';

export async function GET(req: Request) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q');
    const searchTerm = q ? String(q).toLowerCase() : '';

    let users = [];
    if (searchTerm.length >= 2) {
      users = await User.find({
        $or: [
          { firstName: { $regex: searchTerm, $options: 'i' } },
          { lastName: { $regex: searchTerm, $options: 'i' } },
          { email: { $regex: searchTerm, $options: 'i' } },
          { username: { $regex: searchTerm, $options: 'i' } },
        ],
      }).select('firstName lastName email username _id').limit(20);
    }

    return NextResponse.json(users, { status: 200 });
  } catch (error: unknown) {
    console.error('Error fetching users:', error);
    // You can check the error type and return a more specific message if needed.
    // For now, let's return a generic message and log the full error.
    return NextResponse.json({ message: 'Internal Server Error', error: (error as Error).message }, { status: 500 });
  }
}

// For other methods, you might want to return a 405 error
export async function POST(req: Request) {
  return NextResponse.json({ message: `Method ${req.method} Not Allowed` }, { status: 405 });
}
